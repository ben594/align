import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../components/Header'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function HomePage() {
  const { userId } = useParams()
  const [acceptedLabelCount, setAcceptedLabelCount] = useState<0>()
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    fetch(`${BACKEND_URL}/stats?uid=${userId}`)
      .then(response => response.json())
      .then(data => setAcceptedLabelCount(data))
      .catch(error =>
        console.error("Error fetching user's accepted label count:", error)
      )
  }, [userId])
  console.log(acceptedLabelCount)

  useEffect(() => {
    fetch(`${BACKEND_URL}/username?uid=${userId}`)
      .then(response => response.json())
      .then(data => setUserName(data))
      .catch(error => console.error("Error fetching user's name:", error))
  }, [userId])

  return (
    <Box
      flexDirection="column"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Header />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Left section for stats */}
        <VStack align="flex-start">
          <Stat>
            <StatLabel>Account Balance</StatLabel>
            <StatNumber>$768.39</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Accepted Label Count</StatLabel>
            <StatNumber>{acceptedLabelCount}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              34.22%
            </StatHelpText>
          </Stat>
          <Link to="/leaderboard">
            <Button colorScheme="blue">Compare</Button>
          </Link>
        </VStack>

        <VStack spacing={4} align="center">
          <Avatar
            name="Segun Adebayo"
            size="2xl"
            src="https://bit.ly/sage-adebayo"
          />
          <Heading size="md">{userName}</Heading>
          <Text color="gray.500">johnsmith@duke.edu</Text>

          <HStack spacing={2} wrap="wrap" justify="center">
            <Badge colorScheme="pink" variant="solid">
              Tag
            </Badge>
            <Badge colorScheme="purple" variant="solid">
              Tag
            </Badge>
            <Badge colorScheme="green" variant="solid">
              Tag
            </Badge>
            <Badge colorScheme="blue" variant="outline">
              Tag
            </Badge>
            <Badge colorScheme="green" variant="solid">
              Tag
            </Badge>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}
