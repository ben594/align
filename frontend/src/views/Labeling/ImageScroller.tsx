import React, { useState } from "react";
import { Box, Flex, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";

type ImageList = {
  images: string[];
};

export default function ImageScroller({ images }: ImageList) {
  const [imageIndex, setImageIndex] = useState(0);

  const imageCount = images.length;

  const nextImage = () => {
    if (imageIndex < imageCount - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const previousImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  return (
    <Box
      width="750px"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="40px"
          padding="20px"
          borderWidth="2px"
          borderRadius="md"
        >
          <Text>
            {`${imageIndex + 1}/${imageCount}`}
          </Text>
        </Box>
        <Flex>
          <Image
            key={imageIndex}
            src={images[imageIndex]}
            width="640px"
            height="360px"
            objectFit="cover"
          />
        </Flex>
        <IconButton
          position="absolute"
          top="50%"
          left="0px"
          transform="translateY(-50%)"
          onClick={previousImage}
          icon={<ArrowBackIcon />}
          aria-label="Previous Image"
          colorScheme="blue"
        />
        <IconButton
          position="absolute"
          top="50%"
          right="0px"
          transform="translateY(-50%)"
          onClick={nextImage}
          icon={<ArrowForwardIcon />}
          aria-label="Next Image"
          colorScheme="blue"
        />
      </VStack>
    </Box>
  );
}
