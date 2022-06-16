import { Box } from '@chakra-ui/react';
import React from 'react';
import Weather from './Weather';
import WeatherSearch from './WeatherSearch';

const Home = () => {
  return (
    <Box>
      <WeatherSearch />
      <Weather />
    </Box>
  );
};

export default Home;
