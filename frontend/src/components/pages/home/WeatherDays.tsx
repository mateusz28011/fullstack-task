import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { Weather, WeatherDay } from '../../../app/split/weather';
import { getShortDayName } from '../../../utils';

const WeatherDays = ({ data }: { data: Weather | undefined }) => {
  console.log(data);
  return data ? (
    <Flex>
      {data.weatherDays.map((weatherDay) => (
        <Box key={weatherDay.dayNumber}>
          <Stack>
            <Text>{new Date(weatherDay.date).toISOString()}</Text>
            <Text>{getShortDayName(weatherDay.date)}</Text>
          </Stack>
        </Box>
      ))}
    </Flex>
  ) : null;
};

export default WeatherDays;
