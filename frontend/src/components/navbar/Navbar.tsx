import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { isUserAuthenticated } from '../../app/slices/AuthSlice';
import { useLogoutMutation } from '../../app/split/auth';

export default function Navbar() {
  const isAuthenticated = useAppSelector(isUserAuthenticated);
  const [logout] = useLogoutMutation();

  return (
    <Box
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        maxW='8xl'
        mx='auto'
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify='start'>
          <Text
            as={RouterLink}
            to='/'
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Weather App
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            display={isAuthenticated ? 'inline-flex' : 'none'}
            fontSize={'md'}
            fontWeight={'bold'}
            color='red.400'
            variant={'link'}
            onClick={() => logout()}
          >
            Logout
          </Button>
          <Button
            as={RouterLink}
            display={isAuthenticated ? 'none' : 'inline-flex'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={'signin'}
          >
            Sign In
          </Button>
          <Button
            as={RouterLink}
            display={isAuthenticated ? 'none' : 'inline-flex'}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'blue.400'}
            to={'signup'}
            _hover={{
              bg: 'blue.300',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
