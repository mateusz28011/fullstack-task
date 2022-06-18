import copy
from datetime import datetime

from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from ..models import City, WeatherCondition, WeatherDay, WeatherHour

MAX_WEATHER_DAYS = settings.HISTORY_DAYS_COUNT + settings.FORECAST_DAYS_COUNT

# TODO
# FIX
# Used Serializer because of unique constraint
class WeatherConditionInternalSerializer(serializers.Serializer):
    icon = serializers.CharField(max_length=100, required=True)
    text = serializers.CharField(max_length=50, required=True)


class WeatherHourInternalSerializer(serializers.ModelSerializer):
    weather_condition = WeatherConditionInternalSerializer()

    class Meta:
        model = WeatherHour
        exclude = ["weather_day"]


class WeatherDayInternalSerializer(serializers.ModelSerializer):
    weather_hours = WeatherHourInternalSerializer(
        many=True, min_length=24, max_length=24
    )
    weather_condition = WeatherConditionInternalSerializer()

    class Meta:
        model = WeatherDay
        exclude = ["city"]

    def validate_weather_hours(self, weather_hours):
        hours_number_set = set(list(map(lambda wd: wd["hour_number"], weather_hours)))
        if len(hours_number_set) < len(weather_hours):
            raise serializers.ValidationError("Hours numbers must be unique")
        return weather_hours


class WeatherPutInternalSerializer(serializers.Serializer):
    weather_days = WeatherDayInternalSerializer(
        many=True,
        write_only=True,
        min_length=MAX_WEATHER_DAYS,
        max_length=MAX_WEATHER_DAYS,
    )
    name = serializers.CharField(max_length=50)

    def validate_weather_days(self, weather_days):
        days_number_set = set(list(map(lambda wd: wd["day_number"], weather_days)))
        if len(days_number_set) < len(weather_days):
            raise serializers.ValidationError("Days numbers must be unique")
        return weather_days

    def __split_weather_day_and_weather_hours(self, weather_days):
        splited = list(
            map(
                lambda weather_day: (weather_day, weather_day.pop("weather_hours")),
                weather_days,
            )
        )

        # Making sure that items are sorted ascending
        splited.sort(
            key=lambda weather_days_and_weather_hours: weather_days_and_weather_hours[
                0
            ]["day_number"]
        )
        for _, weather_hours in splited:
            weather_hours.sort(key=lambda weather_hour: weather_hour["hour_number"])

        return splited

    def __prepare_weather_day_for_create(self, weather_days_and_weather_hours, city):
        for weather_day, _ in weather_days_and_weather_hours:
            weather_day["city"] = city
            weather_day["weather_condition"] = WeatherCondition.objects.get_or_create(
                **weather_day["weather_condition"],
                defaults=weather_day["weather_condition"]
            )[0]

    def __prepare_weather_hours_for_create(
        self, weather_days_and_weather_hours, created_weather_days
    ):
        for wd_and_wh, cwd in zip(weather_days_and_weather_hours, created_weather_days):
            _, weather_hours = wd_and_wh
            for wh in weather_hours:
                wh["weather_day"] = cwd
                weather_condition, _ = WeatherCondition.objects.get_or_create(
                    **wh["weather_condition"], defaults=wh["weather_condition"]
                )
                wh["weather_condition"] = weather_condition

    def __update_weather(self, city, weather_days):
        city_weather_days_qs = city.weatherday_set.order_by("day_number")
        weather_days_and_weather_hours = self.__split_weather_day_and_weather_hours(
            weather_days
        )

        for weather_day_and_weather_hours in weather_days_and_weather_hours:
            weather_day, weather_hours = weather_day_and_weather_hours
            city_weather_day_qs = city_weather_days_qs.filter(
                day_number=weather_day.pop("day_number")
            )
            weather_day["weather_condition"] = WeatherCondition.objects.get_or_create(
                **weather_day["weather_condition"],
                defaults=weather_day["weather_condition"]
            )[0]
            city_weather_day_qs.update(**weather_day)

            city_weather_day = city_weather_day_qs[0]
            weather_day_hours_qs = city_weather_day.weatherhour_set.order_by(
                "hour_number"
            )

            for weather_hour in weather_hours:
                weather_hour[
                    "weather_condition"
                ] = WeatherCondition.objects.get_or_create(
                    **weather_hour["weather_condition"],
                    defaults=weather_hour["weather_condition"]
                )[
                    0
                ]
                weather_day_hours_qs.filter(
                    hour_number=weather_hour.pop("hour_number")
                ).update(**weather_hour)

    def __create_weather(self, city, weather_days):
        weather_days_and_weather_hours = self.__split_weather_day_and_weather_hours(
            weather_days
        )

        self.__prepare_weather_day_for_create(weather_days_and_weather_hours, city)

        created_weather_days = WeatherDay.objects.bulk_create(
            [
                WeatherDay(**weather_day)
                for weather_day, _ in weather_days_and_weather_hours
            ]
        )

        self.__prepare_weather_hours_for_create(
            weather_days_and_weather_hours, created_weather_days
        )

        for _, weather_hours in weather_days_and_weather_hours:
            WeatherHour.objects.bulk_create([WeatherHour(**wh) for wh in weather_hours])

    def create(self, validated_data):
        with transaction.atomic():
            city_params = {"name": validated_data["name"]}
            city, is_city_created = City.objects.get_or_create(
                **city_params, defaults=city_params
            )

            weather_days = copy.deepcopy(validated_data["weather_days"])
            if is_city_created:
                self.__create_weather(city, weather_days)
            else:
                city.updated_at = datetime.now()
                city.save()
                self.__update_weather(city, weather_days)

        return city
