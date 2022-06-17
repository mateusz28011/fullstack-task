import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Weather } from '../../../app/split/weather';
import WeatherDayBox from './WeatherDayBox';

const WeatherDays = ({ data }: { data: Weather | undefined }) => {
  return data ? (
    <Flex justifyContent='center' columnGap={1}>
      {data.weatherDays.map((weatherDay) => (
        <WeatherDayBox weatherDay={weatherDay} key={weatherDay.dayNumber} />
      ))}
    </Flex>
  ) : null;
};

export default WeatherDays;
