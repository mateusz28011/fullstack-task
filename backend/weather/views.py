from datetime import datetime, timedelta

from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .integration.internal_serializers import WeatherPutInternalSerializer
from .integration.weatherapi import WeatherApi
from .models import City
from .serializers import WeatherGetSerializer


class GetCityWeather(APIView):
    def get(self, request, format=None):
        q = request.GET.get("q", None)
        if q is None:
            raise ValidationError({"detail": 'Query parameter "q" is required'})

        datetime_now = datetime.now()
        # try:
        #     city = City.objects.get(name=q)
        # except:
        #     pass
        # else:
        #     date_after_which_data_is_invalidated = datetime_now - timedelta(
        #         hours=settings.HOURS_TO_INVALIDATE_WEATHER
        #     )
        #     if not (
        #         (city.updated_at < date_after_which_data_is_invalidated)
        #         or (city.updated_at.day != date_after_which_data_is_invalidated.day)
        #     ):
        #         serializer = WeatherGetSerializer(city)
        #         return Response(serializer.data)

        history = []
        for d in reversed(range(1, settings.HISTORY_DAYS_COUNT + 1)):
            dt = datetime_now - timedelta(days=d)
            history.append(WeatherApi.get_history(q, dt.date()))
        forecast = WeatherApi.get_forecast(q)

        transformed_history = list(
            map(
                lambda h: WeatherApi.transform_history_response(h, datetime_now),
                history,
            )
        )
        transformed_data = transformed_history + WeatherApi.transform_forecast_response(
            forecast
        )
        name = forecast["location"]["name"]

        serializer = WeatherPutInternalSerializer(
            data={"weather_days": transformed_data, "name": name}
        )
        serializer.is_valid(raise_exception=True)
        city = serializer.save()

        return Response(WeatherGetSerializer(city).data)
