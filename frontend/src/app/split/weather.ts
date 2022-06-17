import { emptySplitApi } from './';

export interface Weather {
  weatherDays: WeatherDay[];
  name: string;
}

export interface WeatherDay {
  date: string;
  maxtempC: number;
  mintempC: number;
  dayNumber: number;
  weatherCondition: WeatherCondition;
  weatherHours: WeatherHour[];
}

export interface WeatherHour {
  weatherCondition: WeatherCondition;
  hourNumber: number;
  tempC: number;
  cloud: number;
  chanceOfRain: number;
}

export interface WeatherCondition {
  icon: string;
  text: string;
}

export interface GetWeatherRequest {
  q: string;
}

export const weatherApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getWeather: build.query<Weather, GetWeatherRequest>({
      query: (data) => ({
        url: 'weather/forecast/',
        params: { q: data.q },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetWeatherQuery } = weatherApi;
