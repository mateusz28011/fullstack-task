import { useColorModeValue } from '@chakra-ui/color-mode';
import { Container, Flex } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLazyGetLoggedUserQuery } from './app/split/auth';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import { doesHttpOnlyCookieExist } from './utils';
// import SignIn from './components/pages/SignIn';
// import SignUp from './components/pages/SignUp';

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
          <Route path='/' element={<Home />} />
          {/* <Route
            exact
            path={[
              '/datasets/:id',
              '/datasets/:id/clustering/:clusteringId/algorithm/:algorithmId',
              '/datasets/:id/clustering/:clusteringId',
            ]}
          >
            <Dataset /> */}
          {/* </Route> */}
        </Routes>
      </Container>
    </Flex>
  );
}

export default App;
