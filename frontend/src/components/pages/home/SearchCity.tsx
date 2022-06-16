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
  GetWeatherRequest,
  useLazyGetWeatherQuery,
} from '../../../app/split/weather';
import ApiError from '../../ApiError';
import { useAppDispatch } from '../../../app/hooks';

const SearchCity = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GetWeatherRequest>();
  const [trigger] = useLazyGetWeatherQuery();

  const onSubmit = (data: GetWeatherRequest) => {
    trigger(data);
    dispatch(setLastGetWeatherQueryPayload(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.q ? true : false}>
        <InputGroup>
          <Input
            type='text'
            placeholder='City or region'
            {...register('q', {
              required: 'This field is required',
              maxLength: {
                value: 100,
                message:
                  'This field can have maximum of 100 characters characters',
              },
            })}
          />
          <InputRightElement>
            <IconButton
              type='submit'
              aria-label='Search city or region'
              icon={<SearchIcon />}
            />
          </InputRightElement>
        </InputGroup>
        <ApiError error={errors.q?.message} isFormError />
      </FormControl>
    </form>
  );
};

export default SearchCity;
