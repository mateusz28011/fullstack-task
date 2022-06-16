import { useColorModeValue } from '@chakra-ui/color-mode';
import { Container, Flex } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLazyGetLoggedUserQuery } from './app/split/auth';
import Navbar from './components/navbar/Navbar';
import { doesHttpOnlyCookieExist } from './utils';
import Home from './components/pages/home/Home';
import { HOME_PAGE, LOGIN_PAGE, REGISTER_PAGE } from './paths';
import Login from './components/pages/login/Login';
import Register from './components/pages/register/Register';

function App() {
  const location = useLocation();
  const [trigger] = useLazyGetLoggedUserQuery();

  useEffect(() => {
    if (doesHttpOnlyCookieExist('refresh')) {
      trigger();
      console.log('getUser');
    }
  }, [trigger]);

  return (
    <Flex flexDir='column' minH='100vh'>
      <Navbar />
      <Container
        flex='1 1 auto'
        maxW='8xl'
        py='5'
        borderX={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
      >
        <Routes location={location} key={location.pathname}>
          <Route path={HOME_PAGE} element={<Home />} />
          <Route path={LOGIN_PAGE} element={<Login />} />
          <Route path={REGISTER_PAGE} element={<Register />} />
        </Routes>
      </Container>
    </Flex>
  );
}

export default App;
