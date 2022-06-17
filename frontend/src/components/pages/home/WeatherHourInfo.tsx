import { Box, Flex, Image, Text, Stack } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectChoosedHour } from '../../../app/slices/WeatherSlice';

const WeatherHourInfo = ({ location }: { location: string }) => {
  const choosedHour = useAppSelector(selectChoosedHour);

  return (
    <Flex mb={2}>
      <Flex alignItems='center' columnGap={2.5} wrap='wrap'>
        <Image
          boxSize='60px'
          src={`https:${choosedHour?.weatherCondition.icon}`}
          alt={choosedHour?.weatherCondition.text}
        />
        <Flex columnGap={1.5}>
          <Text fontWeight={500} lineHeight={1} fontSize='5xl'>
            {choosedHour?.tempC}
          </Text>
          <Text fontWeight={400} fontSize='xl'>
            °C
          </Text>
        </Flex>
        <Stack spacing={0.5} color='gray.500' mb={2.5}>
          <Text lineHeight={1} fontSize='xs'>
            {`Chance of rain: ${choosedHour?.chanceOfRain}%`}
          </Text>
          <Text
            lineHeight={1}
            fontSize='xs'
          >{`Clouds: ${choosedHour?.cloud}%`}</Text>
        </Stack>
      </Flex>

      <Stack pl={2} mt={2.5} ml='auto' spacing={0.5} textAlign='right'>
        <Text lineHeight={1} fontSize='22px'>
          {location}
        </Text>
        <Text lineHeight={1} color='gray.500'>
          {choosedHour?.weatherCondition.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default WeatherHourInfo;
