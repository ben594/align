import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    if (token) {
      navigate('/dashboard')
    }
  }, [])

  const submitLogin = async () => {
    if (email == '' || password == '') {
      toast({
        title: 'Error',
        description: 'Please enter your email and password.',
        status: 'error',
      })
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${BACKEND_URL}/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )

      if (response.status === 201 || response.status === 200) {
        const token = response.data.access_token
        const user_id = response.data.user_id
        console.log(user_id);
        sessionStorage.setItem('jwt', token)
        sessionStorage.setItem('user_id', user_id)
        navigate('/dashboard')
      } else {
        throw new Error('Failed to login.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login.',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const submitSignup = async () => {
    if (
      email == '' ||
      password == '' ||
      firstname == '' ||
      lastname == '' ||
      password !== confirmedPassword
    ) {
      toast({
        title: 'Error',
        description:
          'Please enter your email and password, and confirm your password.',
        status: 'error',
      })
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${BACKEND_URL}/signup`, {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
      })

      const token = response.data.access_token
      const user_id = response.data.user_id
      sessionStorage.setItem('jwt', token)
      sessionStorage.setItem('user_id', user_id)
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to create account.'

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Header />
      <Tabs
        variant="soft-rounded"
        align="center"
        onChange={() => {
          setEmail('')
          setPassword('')
        }}
      >
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
              <Button
                colorScheme="blue"
                pl="25px"
                pr="25px"
                marginTop="5px"
                onClick={submitLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack width="500px" height="500px" spacing="10px">
              <Heading>Get Started</Heading>
              <Text fontSize="lg" color="gray">
                Start setting up your account
              </Text>
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
              <FormControl
                isRequired
                isInvalid={
                  confirmedPassword !== '' && confirmedPassword !== password
                }
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmedPassword}
                  onChange={e => setConfirmedPassword(e.target.value)}
                />
                {confirmedPassword !== '' && confirmedPassword !== password && (
                  <FormErrorMessage>Passwords do not match</FormErrorMessage>
                )}
              </FormControl>
              <Button
                colorScheme="blue"
                marginTop="5px"
                onClick={submitSignup}
                isLoading={loading}
              >
                Create Account
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
