import {
  Collapse,
  Flex,
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
import { pointer } from '@testing-library/user-event/dist/types/pointer';

type SearchOption = 'city' | 'longitude';

const WeatherSearch = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [searchType, setSearchType] = useState<SearchOption>('city');

  const setCitySearchType = (): void => setSearchType('city');

  return (
    <Box
      mt={8}
      px={4}
      pt={6}
      pb={3}
      shadow='base'
      borderRadius='md'
      maxW='sm'
      mx='auto'
      border={1}
      borderStyle='solid'
      borderColor='gray.200'
    >
      {searchType ? <SearchCity /> : null}
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
              Longitude and latitude
            </Radio>
          </Stack>
        </RadioGroup>
      </Collapse>
    </Box>
  );
};

export default WeatherSearch;
