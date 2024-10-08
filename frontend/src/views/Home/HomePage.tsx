import { Box, Button, Image, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

export default function HomePage() {
  const navigate = useNavigate();
  const goToAuth = () => {
    navigate("/auth");
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Header />
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={10} align="flex-start">
          <Heading size="3xl">
            Fast
            <br />
            Accurate
            <br />
            Labels.
          </Heading>
          <Text color="gray">
            Earn as you help vendors train their AI models.
            <br />
            The end-all solution to your data labeling needs.
          </Text>
          <Button colorScheme="blue" onClick={goToAuth}>
            Get Started
          </Button>
        </VStack>
      </Box>
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <Image padding="5vw" src={"/landingPageImage.png"} />
      </Box>
    </Box>
  );
}
