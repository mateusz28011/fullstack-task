import {
  Collapse,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import SearchCity from './SearchCity';
import { Box } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import SearchLatLon from './SearchLatLon';
import { useAppSelector } from '../../../app/hooks';
import { selectLastGetWeatherQueryPayload } from '../../../app/slices/WeatherSlice';
import { weatherApi } from '../../../app/split/weather';

type SearchOption = 'city' | 'longitude';

const WeatherSearch = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [searchType, setSearchType] = useState<SearchOption>('city');
  const lastGetWeatherQueryPayload = useAppSelector(
    selectLastGetWeatherQueryPayload
  );
  const result = weatherApi.endpoints.getWeather.useQueryState(
    lastGetWeatherQueryPayload ? lastGetWeatherQueryPayload : { q: '' }
  );

  return (
    <Box mt={8} dropShadow='20' maxW='sm' mx='auto' border={1}>
      {searchType === 'city' ? <SearchCity /> : <SearchLatLon />}
      {!result.isFetching ? (
        <>
          <Box>
            <Text
              fontSize='sm'
              mt={2}
              onClick={onToggle}
              _hover={{ cursor: 'pointer' }}
            >
              Choose search option{' '}
              {isOpen ? (
                <ChevronUpIcon color='blue.400' />
              ) : (
                <ChevronDownIcon color='blue.400' />
              )}
            </Text>
          </Box>
          <Collapse in={isOpen} animateOpacity>
            <RadioGroup
              pt={1}
              defaultValue={'city'}
              onChange={(option: SearchOption) => setSearchType(option)}
            >
              <Stack pl={2}>
                <Radio size='sm' value='city' colorScheme='blue'>
                  City or region
                </Radio>
                <Radio size='sm' value='longitude' colorScheme='blue'>
                  Latitude and longitude
                </Radio>
              </Stack>
            </RadioGroup>
          </Collapse>
        </>
      ) : null}
    </Box>
  );
};

export default WeatherSearch;
