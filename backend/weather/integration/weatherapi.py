import json
from datetime import datetime, timedelta

import requests


class WeatherApi:
    __weather_api_url = "https://api.weatherapi.com/v1/"
    __forecast_url = f"{__weather_api_url}forecast.json"
    __history_url = f"{__weather_api_url}history.json"
    __api_key = "fd51bb46bbbd4170948144928221206"
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
    def transform_forecast_response(cls, data):
        parsed_data = []

        forecast_days = data["forecast"]["forecastday"]
        for idx, weather_day in enumerate(forecast_days):
            weather_day["day_number"] = idx
            weather_day["weather_hours"] = list(
                map(cls.__add_hour_number, weather_day["hour"])
            )

            parsed_data.append(weather_day)

        return parsed_data

    @classmethod
    def transform_history_response(cls, data, datetime_now):
        weather_day = data["forecast"]["forecastday"][0]

        weather_day_date = datetime.fromisoformat(weather_day["date"])
        weather_day["day_number"] = -(datetime_now - weather_day_date).days
        weather_day["weather_hours"] = list(
            map(cls.__add_hour_number, weather_day["hour"])
        )

        return weather_day
