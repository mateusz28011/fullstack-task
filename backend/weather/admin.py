from django.contrib import admin

from .models import City, WeatherDay, WeatherHour

admin.site.register(City)
admin.site.register(WeatherDay)
admin.site.register(WeatherHour)
