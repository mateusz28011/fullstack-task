import { Image, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { WeatherDay } from '../../../app/split/weather';
import { getShortDayName } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectChoosedHour,
  setChoosedHour,
} from '../../../app/slices/WeatherSlice';
import {
  selectChoosedDay,
  setChoosedDay,
} from '../../../app/slices/WeatherSlice';

const WeatherDayItem = ({ weatherDay }: { weatherDay: WeatherDay }) => {
  const dispatch = useAppDispatch();
  const choosedDay = useAppSelector(selectChoosedDay);
  const choosedHour = useAppSelector(selectChoosedHour);
  const isChoosed = choosedDay
    ? choosedDay.dayNumber === weatherDay.dayNumber
    : false;

  const changeChoosedDay = () => {
    const weatherHourNew = weatherDay.weatherHours.find(
      (weatherHour) => weatherHour.hourNumber === choosedHour?.hourNumber
    );
    if (weatherHourNew) {
      dispatch(setChoosedDay(weatherDay));
      dispatch(setChoosedHour(weatherHourNew));
    }
  };

  return (
    <Stack
      px={1}
      backgroundColor={isChoosed ? 'gray.100' : undefined}
      _hover={{
        cursor: !isChoosed ? 'pointer' : 'auto',
        backgroundColor: !isChoosed ? 'gray.50' : undefined,
      }}
      borderRadius='md'
      justifyContent='center'
      textAlign='center'
      alignItems='center'
      flexShrink={0}
      spacing={0}
      onClick={!isChoosed ? changeChoosedDay : undefined}
    >
      <Text>{getShortDayName(weatherDay.date)}.</Text>
      <Image
        boxSize='60px'
        src={`https:${weatherDay.weatherCondition.icon}`}
        alt={weatherDay.weatherCondition.text}
      />
      <Stack direction='row' spacing={1}>
        <Text fontSize='13px'>{weatherDay.maxtempC}°</Text>
        <Text fontSize='13px' color='gray.500'>
          {weatherDay.mintempC}°
        </Text>
      </Stack>
    </Stack>
  );
};

export default WeatherDayItem;
