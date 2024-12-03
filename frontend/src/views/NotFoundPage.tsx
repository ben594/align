import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; 

const NotFoundPage = () => {
    return (
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        width="100vw"
      >
        <Heading as="h1" fontSize="6xl" mb={4} color="blue.500">
          404
        </Heading>
        <Text fontSize="lg" mb={6}>
          Oops! The page you're looking for doesn't exist.
        </Text>
        <Link to="/">
          <Button colorScheme="blue" size="lg">
            Go Home
          </Button>
        </Link>
      </Box>
    );
  };
  
  export default NotFoundPage;
