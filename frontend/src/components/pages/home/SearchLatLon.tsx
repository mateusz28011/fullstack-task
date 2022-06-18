import { SearchIcon } from '@chakra-ui/icons';
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { setLastGetWeatherQueryPayload } from '../../../app/slices/WeatherSlice';
import {
  GetWeatherLotLanRequest,
  useLazyGetWeatherQuery,
} from '../../../app/split/weather';
import ApiError from '../../ApiError';
import { useAppDispatch } from '../../../app/hooks';

const SearchLatLon = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GetWeatherLotLanRequest>();
  const [trigger, { isFetching }] = useLazyGetWeatherQuery();

  const onSubmit = (data: GetWeatherLotLanRequest) => {
    const q = { q: `${data.lat},${data.lon}` };
    trigger(q);
    dispatch(setLastGetWeatherQueryPayload(q));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.lat || errors.lon ? true : false}
        isDisabled={isFetching}
      >
        <InputGroup>
          <Input
            type='number'
            placeholder='Latitude'
            borderRightRadius={0}
            {...register('lat', {
              required: 'Latitude field is required',
              maxLength: {
                value: 10,
                message:
                  'Latitude can have maximum of 10 characters characters',
              },
              max: {
                value: 90,
                message: 'Latitude maximum value is 90',
              },
              min: {
                value: -90,
                message: 'Latitude minimum value is -90',
              },
            })}
          />
          <Input
            borderLeftRadius={0}
            type='number'
            placeholder='Longitude'
            {...register('lon', {
              required: 'Longitude field is required',
              maxLength: {
                value: 10,
                message:
                  'Longitude can have maximum of 10 characters characters',
              },
              max: {
                value: 180,
                message: 'Latitude maximum value is 180',
              },
              min: {
                value: -180,
                message: 'Latitude minimum value is -180',
              },
            })}
          />
          <InputRightElement>
            <IconButton
              isDisabled={isFetching}
              type='submit'
              aria-label='Search city or region'
              icon={<SearchIcon />}
            />
          </InputRightElement>
        </InputGroup>
        <ApiError error={errors.lat?.message} isFormError />
        <ApiError error={errors.lon?.message} isFormError />
      </FormControl>
    </form>
  );
};

export default SearchLatLon;
