import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Weather } from '../../../app/split/weather';
import WeatherDayItem from './WeatherDayItem';

const WeatherDays = ({ data }: { data: Weather | undefined }) => {
  return data ? (
    <Flex columnGap={1} overflowX='auto' py={4}>
      {data.weatherDays.map((weatherDay) => (
        <WeatherDayItem weatherDay={weatherDay} key={weatherDay.dayNumber} />
      ))}
    </Flex>
  ) : null;
};

export default WeatherDays;
