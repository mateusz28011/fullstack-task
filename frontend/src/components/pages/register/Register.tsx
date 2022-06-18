import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, VStack, Link, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useApiError from '../../../hooks/useApiError';
import { RegisterRequest, useRegisterMutation } from '../../../app/split/auth';
import ApiError from '../../ApiError';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useColorModeValue, useToast } from '@chakra-ui/react';
import { isUserAuthenticated } from '../../../app/slices/AuthSlice';
import { useAppSelector } from '../../../app/hooks';
import { LOGIN_PAGE } from '../../../paths';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSubmit, register: registerInput } = useForm<RegisterRequest>();
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
  const apiErrors = useApiError<RegisterRequest, keyof RegisterRequest>(error, [
    'email',
    'password1',
    'password2',
  ]);
  const isAuthenticated = useAppSelector(isUserAuthenticated);

  const onSubmit = (data: RegisterRequest) => {
    register(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Successfully registered!',
        description: 'Now you can sign in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
      navigate(LOGIN_PAGE);
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
        Create your account
      </Text>
      <Text fontSize='large' mt={5} mb={12} textAlign='center'>
        Already has account?
        <Link
          as={RouterLink}
          ml='2'
          to='signin'
          color='blue.400'
          fontWeight='medium'
        >
          Sign in
        </Link>
      </Text>
      <Box maxW='sm' paddingX='1rem' marginX='auto'>
        <ApiError error={apiErrors.mainError} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <FormControl isInvalid={apiErrors.email?.isError} w='full'>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input type='email' required {...registerInput('email')} />
              <ApiError error={apiErrors.email?.error} isFormError />
            </FormControl>
            <FormControl isInvalid={apiErrors.password1?.isError} w='full'>
              <FormLabel htmlFor='password1'>Password</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  required
                  {...registerInput('password1')}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <ApiError error={apiErrors.password1?.error} isFormError />
            </FormControl>
            <FormControl isInvalid={apiErrors.password2?.isError} w='full'>
              <FormLabel htmlFor='password2'>Confirm password</FormLabel>
              <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                required
                {...registerInput('password2')}
              />
              <ApiError error={apiErrors.password2?.error} isFormError />
            </FormControl>
          </VStack>

          <Button
            width='full'
            marginTop='4'
            isLoading={isLoading}
            type='submit'
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUp;
