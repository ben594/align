/**
 * LabelList.tsx
 *
 * This file defines a `LabelList` component that displays a list of labels.
 * Each label shows the project name, project ID, the label text, and its acceptance status.
 */

import { Box, Text, Badge, VStack } from '@chakra-ui/react'
import { Label } from '../views/Profile/ProfilePage'

type LabelListProps = {
  labels: Label[]
}

export default function LabelList({ labels }: LabelListProps) {
  return (
    <Box maxW="4xl" mx="auto" p={5} boxShadow="xl" bg="white" mt={5} mb={55}>
      {labels.length > 0 ? (
        <VStack spacing={5} align="stretch">
          {labels
            .slice()
            .reverse() //reverse chronological order
            .map((label, index) => (
              <Box key={index} p={4} bg="gray.50" boxShadow="sm">
                <Text fontSize="lg">{label.project_name}</Text>
                <Text fontSize="sm" color="gray.600">
                  Project ID: {label.project_id}
                </Text>
                Your label: {label.label_text} <br></br>
                <Badge colorScheme={label.accepted_status ? 'green' : 'gray'}>
                  {label.accepted_status ? 'Accepted' : 'Not accepted'}
                </Badge>
              </Box>
            ))}
        </VStack>
      ) : (
        <Text>No labels available</Text>
      )}
    </Box>
  )
}
