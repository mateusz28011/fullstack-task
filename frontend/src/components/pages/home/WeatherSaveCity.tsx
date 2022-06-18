import { Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSaveUserCityMutation } from '../../../app/split/auth';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../app/slices/AuthSlice';
import { useEffect } from 'react';

const WeatherSaveCity = ({ cityId }: { cityId: number }) => {
  const [saveUserCity, { isLoading, isSuccess, isError }] =
    useSaveUserCityMutation();
  const toast = useToast();
  const user = useAppSelector(selectCurrentUser);
  const isDefaultCity = user ? user.savedCity?.id === cityId : null;
  const saveUserCityFunc = () => saveUserCity({ savedCity: cityId });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Successfully saved default city!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
    }
  }, [isSuccess, toast]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Something went wrong!',
        description: 'Could not save default city',
        status: 'error',
        duration: 5000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
    }
  }, [isError, toast]);

  return !isDefaultCity ? (
    <Text
      lineHeight={1}
      mb={2}
      fontSize='sm'
      onClick={!isLoading ? saveUserCityFunc : undefined}
      _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
    >
      {!isLoading ? (
        <>
          <Text as='span' color='blue.600' fontWeight={600}>
            Save
          </Text>{' '}
          as default city
        </>
      ) : (
        'Saving...'
      )}
    </Text>
  ) : null;
};

export default WeatherSaveCity;
