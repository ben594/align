import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const submitLogin = async () => {
    if (email == '' || password == '') {
      toast({
        title: 'Error',
        description: 'Please enter your email and password.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return;
    }

    try {
      setLoading(true)
      const response = await axios.post(`${BACKEND_URL}/login`, {
        email: email,
        password: password,
      })

      if (response.status === 201 || response.status === 200) {
        navigate('/dashboard')
      } else {
        throw new Error('Failed to login.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const submitSignup = async () => {
    if (email == '' || password == '' || firstname == '' || lastname == '' || password !== confirmedPassword) {
      toast({
        title: 'Error',
        description:
          'Please enter your email and password, and confirm your password.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/signup`, {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
      })

      if (response.status === 201 || response.status === 200) {
        navigate('/dashboard')
      } else {
        throw new Error('Failed to create account.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Header />
      <Tabs variant="soft-rounded" align="center" onChange={() => {setEmail(''); setPassword('');}}>
        <TabList>
          <Tab margin="10px">Login</Tab>
          <Tab margin="10px">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack width="500px" height="500px" spacing="15px">
              <Heading>Login</Heading>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" pl="25px" pr="25px" marginTop="5px" onClick={submitLogin} isLoading={loading}>
                Login
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack width="500px" height="500px" spacing="10px">
              <Heading>Get Started</Heading>
              <Text fontSize='lg' color='gray'>Start setting up your account</Text>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormControl>
              <HStack width="100%" spacing="5px">
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                  />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired isInvalid={confirmedPassword !== '' && confirmedPassword !== password}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmedPassword}
                  onChange={e => setConfirmedPassword(e.target.value)}
                />
                {
                  (confirmedPassword !== '' && confirmedPassword !== password) &&
                  <FormErrorMessage>Passwords do not match</FormErrorMessage>
                }
              </FormControl>
              <Button colorScheme="blue" marginTop="5px" onClick={submitSignup} isLoading={loading}>
                Create Account
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
