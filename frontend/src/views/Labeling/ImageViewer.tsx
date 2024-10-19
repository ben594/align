import React, { useState } from 'react'
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

export default function ImageViewer({ imageURL }) {
  return (
    <Box
      width="750px"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Flex>
        <Image src={imageURL} width="640px" height="360px" objectFit="cover" />
      </Flex>
    </Box>
  )
}
