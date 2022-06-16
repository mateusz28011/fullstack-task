import React from 'react';
import {
  useLazyGetWeatherQuery,
  weatherApi,
  WeatherDay,
} from '../../../app/split/weather';
import { useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectLastGetWeatherQueryPayload } from '../../../app/slices/WeatherSlice';
import { Box } from '@chakra-ui/react';
import WeatherDays from './WeatherDays';

const Weather = () => {
  const lastGetWeatherQueryPayload = useAppSelector(
    selectLastGetWeatherQueryPayload
  );
  const result = weatherApi.endpoints.getWeather.useQueryState(
    lastGetWeatherQueryPayload ? lastGetWeatherQueryPayload : { q: '' }
  );
  console.log(result);

  return (
    <Box>
      <WeatherDays data={result.data} />
    </Box>
  );
};

export default Weather;
