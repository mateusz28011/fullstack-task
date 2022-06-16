from django.contrib.postgres.fields import CICharField
from django.db import models


class City(models.Model):
    name = CICharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class WeatherDay(models.Model):
    Days = models.IntegerChoices("Days", [(str(i), i) for i in range(-5, 3)])

    date = models.DateField()
    day_number = models.SmallIntegerField(choices=Days.choices)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["city", "day_number"]


class WeatherCondition(models.Model):
    icon = models.CharField(max_length=100)
    text = models.CharField(max_length=50)

    class Meta:
        unique_together = ["icon", "text"]


class WeatherHour(models.Model):
    Hours = models.IntegerChoices("Hours", [(str(i), i) for i in range(24)])

    weather_day = models.ForeignKey(WeatherDay, on_delete=models.CASCADE)
    weather_condition = models.ForeignKey(
        WeatherCondition, on_delete=models.SET_NULL, null=True
    )
    hour_number = models.SmallIntegerField(choices=Hours.choices)
    temp_c = models.FloatField()
    cloud = models.SmallIntegerField()
    chance_of_rain = models.SmallIntegerField()

    class Meta:
        unique_together = ["weather_day", "hour_number"]
