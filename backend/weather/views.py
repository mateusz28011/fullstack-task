from rest_framework.response import Response
from rest_framework.views import APIView

from .integration.internal_serializers import WeatherPutInternalSerializer
from .integration.weatherapi import WeatherApi


class GetCityWeather(APIView):

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        forecast = WeatherApi.get_forecast("rzepin")
        transformed_forecast = WeatherApi.transform_forecast_response(forecast)
        serializer = WeatherPutInternalSerializer(
            data={"weather_days": transformed_forecast, "city": "rzepin"}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.validated_data)
        # return Response(transformed_forecast)
