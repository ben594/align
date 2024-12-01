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
    <Box maxW="4xl" mx="auto" p={5} boxShadow="xl" bg="white" mt={5}>
      {labels.length > 0 ? (
        <VStack spacing={5} align="stretch">
          {labels.map((label, index) => {
            console.log("Label Status:", label.accepted_status); // Debugging line
            return (
              <Box key={index} p={4} bg="gray.50" boxShadow="sm">
                <Text fontSize="lg" fontWeight="bold">
                  Project ID: {label.project_id}
                </Text>
                <Text fontSize="md" color="gray.600">
                  Label: {label.label_text}
                </Text>
                {/* Add a check to ensure accepted_status exists */}
                <Badge colorScheme={label.accepted_status === 'approved' ? 'green' : 'red'}>
                  {label.accepted_status || 'Status unknown'}
                </Badge>
                {index !== labels.length - 1 && <Divider my={4} />}
              </Box>
            );
          })}
        </VStack>
      ) : (
        <Text>No labels available</Text>
      )}
    </Box>
  );
}
