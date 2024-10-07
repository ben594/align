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

export default function HomePage() {
  return (
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
          <StatNumber>534,200</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            34.22%
          </StatHelpText>
        </Stat>

        <Button colorScheme="blue">Compare</Button>
      </VStack>

      {/* Right section for profile */}
      <VStack spacing={4} align="center">
        <Avatar
          name="Segun Adebayo"
          size="2xl"
          src="https://bit.ly/sage-adebayo"
        />
        <Heading size="md">John Smith</Heading>
        <Text color="gray.500">johnsmith@duke.edu</Text>

        {/* Achievements section */}
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
  )
}
