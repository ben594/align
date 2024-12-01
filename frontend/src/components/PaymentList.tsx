import { Box, Text, Badge, VStack, Divider } from '@chakra-ui/react'
import { Payment } from '../views/Profile/ProfilePage'

type PaymentListProps = {
  payments: Payment[]
}

export default function PaymentList({ payments }: PaymentListProps) {
  return (
    <Box maxW="4xl" mx="auto" p={5} boxShadow="xl" bg="white" mt={5} mb={55}>
      {payments.length > 0 ? (
        <VStack spacing={5} align="stretch">
          {payments
            .slice()
            .reverse() //reverse chronological order
            .map((payment, index) => (
              <Box key={index} p={4} bg="gray.50" boxShadow="sm">
                {payment.balanceChange >= 0 && <Text fontSize="md">From: {payment.senderID}</Text>}
                {payment.balanceChange < 0 && <Text fontSize="md">To: {payment.senderID}</Text>}
                <Text fontSize="md" color="gray.800">
                  Time: {payment.transactionTime}
                </Text>
                <Text fontSize="md" color="gray.800">
                  Change in your balance: {payment.balanceChange}
                </Text>
              </Box>
            ))}
        </VStack>
      ) : (
        <Text>No payments available</Text>
      )}
    </Box>
  )
}
