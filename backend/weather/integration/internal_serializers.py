from django.db import transaction
from rest_framework import serializers

from ..models import City, WeatherCondition, WeatherDay, WeatherHour


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
        many=True, write_only=True, min_length=1, max_length=5
    )
    city = serializers.CharField(max_length=50)

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
        splited.sort(
            key=lambda weather_days_and_weather_hours: weather_days_and_weather_hours[
                0
            ]["day_number"]
        )
        return splited

    def __prepare_weather_day_for_create(self, weather_days_and_weather_hours, city):
        for weather_day, _ in weather_days_and_weather_hours:
            weather_day["city"] = city

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
        pass

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
            city_params = {"name": validated_data["city"]}
            city, is_city_created = City.objects.get_or_create(defaults=city_params)

            if is_city_created:
                self.__create_weather(city, validated_data["weather_days"])
            else:
                self.__update_weather(city, validated_data["weather_days"])

        return {"city": city.name}
