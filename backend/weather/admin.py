from django.contrib import admin

from .models import City, WeatherCondition, WeatherDay, WeatherHour

admin.site.register(City)
admin.site.register(WeatherDay)
admin.site.register(WeatherHour)
admin.site.register(WeatherCondition)
