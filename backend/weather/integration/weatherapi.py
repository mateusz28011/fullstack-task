from datetime import datetime, timedelta

import requests
from django.conf import settings


class WeatherApi:
    __weather_api_url = "https://api.weatherapi.com/v1/"
    __forecast_url = f"{__weather_api_url}forecast.json"
    __history_url = f"{__weather_api_url}history.json"
    __api_key = settings.WEATHERAPI_KEY
    __common_params = {"key": __api_key, "alerts": "no", "aqi": "no"}

    @classmethod
    def get_forecast(cls, q, days=3):
        response = requests.get(
            cls.__forecast_url,
            params={**cls.__common_params, "q": q, "days": days},
        )

        return response.json()

    @classmethod
    def get_history(cls, q, dt_date=datetime.now().date() - timedelta(days=1)):
        response = requests.get(
            cls.__history_url,
            params={**cls.__common_params, "q": q, "dt": dt_date},
        )

        return response.json()

    @classmethod
    def __add_hour_number(cls, hour):
        hour["hour_number"] = datetime.fromtimestamp(hour["time_epoch"]).hour
        hour["weather_condition"] = hour["condition"]
        return hour

    @classmethod
    def __prepare_weather_day(cls, weather_day, index):
        weather_day["day_number"] = index
        weather_day["weather_hours"] = list(
            map(cls.__add_hour_number, weather_day["hour"])
        )
        weather_day["maxtemp_c"] = weather_day["day"]["maxtemp_c"]
        weather_day["mintemp_c"] = weather_day["day"]["mintemp_c"]
        weather_day["weather_condition"] = weather_day["day"]["condition"]

    @classmethod
    def transform_forecast_response(cls, data):
        parsed_data = []

        forecast_days = data["forecast"]["forecastday"]
        for idx, weather_day in enumerate(forecast_days):
            cls.__prepare_weather_day(weather_day, idx)

            parsed_data.append(weather_day)

        return parsed_data

    @classmethod
    def transform_history_response(cls, data, datetime_now):
        weather_day = data["forecast"]["forecastday"][0]

        weather_day_date = datetime.fromisoformat(weather_day["date"])
        cls.__prepare_weather_day(weather_day, -(datetime_now - weather_day_date).days)

        return weather_day
