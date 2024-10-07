import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons'
import FlexRow from '../../components/FlexRow'

type ImageList = {
  interface_type: 'label' | 'review'
  images: string[]
}

export default function ImageScroller({ images, interface_type }: ImageList) {
  const [imageIndex, setImageIndex] = useState(0)

  const imageCount = images.length

  const nextImage = () => {
    if (imageIndex < imageCount - 1) {
      setImageIndex(imageIndex + 1)
    }
  }

  const previousImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1)
    }
  }

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
          <Text>{`${imageIndex + 1}/${imageCount}`}</Text>
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

        <Textarea placeholder="What is this image of?" />

        {interface_type === 'label' && (
          <FlexRow width="100%" columnGap={1}>
            <Button flexGrow={1} colorScheme="blue">
              Submit
            </Button>
          </FlexRow>
        )}
        {interface_type === 'review' && (
          <FlexRow width="100%" columnGap={1}>
            <Button flexGrow={1} colorScheme="red">
              Reject
            </Button>
            <Button flexGrow={1} colorScheme="green">
              Accept
            </Button>
          </FlexRow>
        )}
      </VStack>
    </Box>
  )
}
