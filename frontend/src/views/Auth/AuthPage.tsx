import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const toast = useToast();

  const submitLogin = async () => {
    if (email == "" || password == "") {
      toast({
        title: "Error",
        description: "Please enter your email and password.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const submitSignup = async () => {
    if (email == "" || password == "") {
      toast({
        title: "Error",
        description:
          "Please enter your email and password, and confirm your password.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Tabs variant="soft-rounded" align="center">
        <TabList>
          <Tab margin="10px">Login</Tab>
          <Tab margin="10px">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack width="500px" height="500px">
              <Heading>Login</Heading>
              <FormControl margin="10px">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl margin="10px">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" width="100px" onClick={submitLogin}>
                Login
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack width="500px" height="500px">
              <Heading>Get Started with Align</Heading>
              <FormControl margin="10px">
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl margin="10px">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl margin="10px">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" width="100px" onClick={submitSignup}>
                Sign Up
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
