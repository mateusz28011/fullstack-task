import json
from datetime import datetime

import requests


class WeatherApi:
    __weather_api_url = "https://api.weatherapi.com/v1/"
    __forecast_url = f"{__weather_api_url}forecast.json"
    __api_key = "fd51bb46bbbd4170948144928221206"

    @classmethod
    def get_forecast(cls, q, days=3):
        response = requests.get(
            cls.__forecast_url,
            params={
                "key": cls.__api_key,
                "q": q,
                "days": days,
                "alerts": "no",
                "aqi": "no",
            },
        )

        return response.json()

    @classmethod
    def __add_hour_number(cls, hour):
        hour["hour_number"] = datetime.fromtimestamp(hour["time_epoch"]).hour
        hour["weather_condition"] = hour.pop("condition")
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
            del weather_day["hour"]

            parsed_data.append(weather_day)

        return parsed_data

