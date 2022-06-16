from datetime import datetime, timedelta

from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .integration.internal_serializers import WeatherPutInternalSerializer
from .integration.weatherapi import WeatherApi


class GetCityWeather(APIView):

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        q = request.GET.get("q", None)
        if q is None:
            raise ValidationError({"detail": 'Query parameter "q" is required'})

        history = []
        datetime_now = datetime.now()
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
        city = forecast["location"]["name"]

        serializer = WeatherPutInternalSerializer(
            data={"weather_days": transformed_data, "city": city}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.validated_data)
