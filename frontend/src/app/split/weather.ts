import { emptySplitApi } from './';

export interface City {
  id: number;
  name: string;
}

export interface CityWithWeather extends City {
  weatherDays: WeatherDay[];
}

export interface WeatherDay {
  id: number;
  date: string;
  maxtempC: number;
  mintempC: number;
  dayNumber: number;
  weatherCondition: WeatherCondition;
  weatherHours: WeatherHour[];
}

export interface WeatherHour {
  id: number;
  weatherCondition: WeatherCondition;
  hourNumber: number;
  tempC: number;
  cloud: number;
  chanceOfRain: number;
}

export interface WeatherCondition {
  id: number;
  icon: string;
  text: string;
}

export interface GetWeatherRequest {
  q: string;
}
export interface GetWeatherLotLanRequest {
  lat: number;
  lon: number;
}

export const weatherApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getWeather: build.query<CityWithWeather, GetWeatherRequest>({
      query: (data) => ({
        url: 'weather/forecast/',
        params: { q: data.q },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetWeatherQuery } = weatherApi;
