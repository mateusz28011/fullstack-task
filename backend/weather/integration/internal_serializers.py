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

    def create(self, validated_data):
        with transaction.atomic():
            city_params = {"name": validated_data["city"]}
            city, _ = City.objects.get_or_create(**city_params, defaults=city_params)
            city.save()

            for weather_day in validated_data["weather_days"]:
                weather_hours = weather_day.pop("weather_hours")
                weather_day_params = {
                    "city": city,
                    **weather_day,
                }

                wd, _ = WeatherDay.objects.get_or_create(
                    **weather_day_params, defaults=weather_day_params
                )
                wd.save()

                for weather_hour in weather_hours:
                    print(weather_hour)
                    weather_hour_params = {**weather_hour, "weather_day": wd}
                    weather_condition_params = weather_hour_params.pop(
                        "weather_condition"
                    )

                    wc, _ = WeatherCondition.objects.get_or_create(
                        **weather_condition_params, defaults=weather_condition_params
                    )
                    wc.save()

                    weather_hour_params["weather_condition"] = wc
                    wh, _ = WeatherHour.objects.update_or_create(
                        weather_day=wd,
                        hour_number=weather_hour["hour_number"],
                        defaults=weather_hour_params,
                    )
                    wh.save()

        return {"city": city.name}