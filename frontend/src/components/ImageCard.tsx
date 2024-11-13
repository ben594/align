import React from 'react';
import { Box, Image, Text, Tag, VStack, HStack } from '@chakra-ui/react';

interface ImageCardProps {
  image_url: string;
  tags: string[];
  label?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image_url, tags, label }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" p="4" bg="white">
      <Image src={image_url} alt={label} w="100%" h="200px" objectFit="contain" bg="white" />
      <VStack align="start" mt="4" spacing="2">
        <HStack spacing="2">
          {tags.map((tag, index) => (
            <Tag key={index} colorScheme="blue">
              {tag}
            </Tag>
          ))}
        </HStack>
        <Text>
          Label: {label}
        </Text>
      </VStack>
    </Box>
  );
};



export default ImageCard;
