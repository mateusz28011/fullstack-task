import React from 'react';
import { weatherApi } from '../../../app/split/weather';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectChoosedDay,
  selectLastGetWeatherQueryPayload,
  setChoosedDay,
  setChoosedHour,
} from '../../../app/slices/WeatherSlice';
import {
  AbsoluteCenter,
  Box,
  Center,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import WeatherDays from './WeatherDays';
import WeatherHours from './WeatherHours';
import WeatherHourInfo from './WeatherHourInfo';
import WeatherSaveCity from './WeatherSaveCity';

const Weather = () => {
  const choosedDay = useAppSelector(selectChoosedDay);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const lastGetWeatherQueryPayload = useAppSelector(
    selectLastGetWeatherQueryPayload
  );
  const result = weatherApi.endpoints.getWeather.useQueryState(
    lastGetWeatherQueryPayload ? lastGetWeatherQueryPayload : { q: '' }
  );

  useEffect(() => {
    if (!choosedDay && result.data?.weatherDays) {
      const currentDate = new Date();
      const currentDay = result.data?.weatherDays.find(
        (day) =>
          new Date(day.date).toDateString() === currentDate.toDateString()
      );
      currentDay && dispatch(setChoosedDay(currentDay));
      if (currentDay) {
        const currentHour = currentDay.weatherHours.find(
          (hour) => hour.hourNumber === currentDate.getHours()
        );
        currentHour && dispatch(setChoosedHour(currentHour));
      }
    }
  }, [result, choosedDay, dispatch]);

  useEffect(() => {
    if (result.isError) {
      toast({
        title: 'Something went wrong!',
        description: 'Could not fetch weather data',
        status: 'error',
        duration: 5000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
    }
  }, [result.isError, toast]);

  return !result.isLoading ? (
    result.data ? (
      <Box
        maxW='fit-content'
        mx='auto'
        opacity={result.isFetching ? '75%' : undefined}
        pos='relative'
      >
        <WeatherHourInfo location={result.data.name} />
        <WeatherSaveCity cityId={result.data.id} />
        <WeatherHours />
        <WeatherDays data={result.data} />
      </Box>
    ) : null
  ) : (
    <Center>
      <Spinner color='blue.500' mx='auto' size='xl' mt={20} />
    </Center>
  );
};

export default Weather;
