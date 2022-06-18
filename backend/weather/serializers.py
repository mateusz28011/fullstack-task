from rest_framework import serializers

from .models import City, WeatherDay, WeatherHour


class WeatherHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherHour
        exclude = ["weather_day"]
        depth = 1


class WeatherDaySerializer(serializers.ModelSerializer):
    weather_hours = serializers.SerializerMethodField()

    class Meta:
        model = WeatherDay
        exclude = ["city"]
        depth = 1

    def get_weather_hours(self, obj):
        weather_hours = obj.weatherhour_set.order_by("hour_number").all()
        return WeatherHourSerializer(weather_hours, many=True).data


class WeatherGetSerializer(serializers.ModelSerializer):
    weather_days = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = ["name", "weather_days", "id"]
        depth = 3

    def get_weather_days(self, obj):
        weather_days = obj.weatherday_set.all()
        return WeatherDaySerializer(weather_days, many=True).data
