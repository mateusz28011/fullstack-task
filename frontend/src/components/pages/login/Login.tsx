import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, VStack, Link, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useApiError from '../../../hooks/useApiError';
import { LoginRequest, useLoginMutation } from '../../../app/split/auth';
import ApiError from '../../ApiError';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useColorModeValue, useToast } from '@chakra-ui/react';
import { HOME_PAGE } from '../../../paths';
import { useAppSelector } from '../../../app/hooks';
import { isUserAuthenticated } from '../../../app/slices/AuthSlice';

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSubmit, register } = useForm<LoginRequest>();
  const [login, { isLoading, error, isSuccess }] = useLoginMutation();
  const apiErrors = useApiError<LoginRequest, keyof LoginRequest>(error, [
    'email',
    'password',
  ]);
  const isAuthenticated = useAppSelector(isUserAuthenticated);

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Successfully logged in!',
        description: 'Now you can sign in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
      navigate(HOME_PAGE);
    }
  }, [isSuccess, navigate, toast]);

  useEffect(() => {
    isAuthenticated && navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <Box
      w='fit-content'
      mx='auto'
      rounded='lg'
      shadow='md'
      mt={24}
      px={[2, 6, 10]}
      py={10}
      border={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Text fontSize='4xl' fontWeight='bold' textAlign='center'>
        Sign in to your account
      </Text>
      <Text fontSize='large' mt={5} mb={12} textAlign='center'>
        Don't have an account yet?
        <Link
          as={RouterLink}
          ml='2'
          to='signup'
          color='blue.400'
          fontWeight='medium'
        >
          Sign up
        </Link>
      </Text>
      <Box maxW='sm' paddingX='1rem' marginX='auto'>
        <ApiError error={apiErrors.mainError} />
        <ApiError error={apiErrors.nonFieldErrors} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <FormControl isInvalid={apiErrors.email?.isError} w='full'>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input type='email' required {...register('email')} />
              <ApiError error={apiErrors.email?.error} isFormError />
            </FormControl>
            <FormControl isInvalid={apiErrors.password?.isError} w='full'>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  required
                  {...register('password')}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <ApiError error={apiErrors.password?.error} isFormError />
            </FormControl>
          </VStack>

          <Button
            width='full'
            marginTop='4'
            isLoading={isLoading}
            type='submit'
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
