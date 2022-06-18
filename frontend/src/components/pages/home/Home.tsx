import { Box, Divider } from '@chakra-ui/react';
import React from 'react';
import Weather from './Weather';
import WeatherSearch from './WeatherSearch';

const Home = () => {
  return (
    <Box>
      <WeatherSearch />
      <Divider my={8} visibility='hidden' />
      <Weather />
    </Box>
  );
};

export default Home;
