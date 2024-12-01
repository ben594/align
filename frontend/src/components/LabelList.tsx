import { Box, Text, Badge, VStack, Divider } from '@chakra-ui/react';

type Label = {
  project_id: number;
  accepted_status: string;
  label_text: string;
};

type LabelListProps = {
  labels: Label[];
};

export default function LabelList({ labels }: LabelListProps) {
  return (
    <Box maxW="4xl" mx="auto" p={5} boxShadow="xl" bg="white" mt={5} mb={55}>
      {labels.length > 0 ? (
        <VStack spacing={5} align="stretch">
          {labels
            .slice() 
            .reverse() //reverse chronological order
            .map((label, index) =>(
            <Box key={index} p={4} bg="gray.50" boxShadow="sm">
              <Text fontSize="md">
                Project ID: {label.project_id}
              </Text>
              <Text fontSize="md" color="gray.800">
                Your label: {label.label_text}
              </Text>
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
  );
}
