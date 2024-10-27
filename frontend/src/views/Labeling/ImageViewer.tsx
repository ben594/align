import { Box, Flex } from '@chakra-ui/react'

import ZoomableImage from '../../components/ZoomableImage'

interface ImageViewerProps {
  imageURL: string
}

export default function ImageViewer({ imageURL }: ImageViewerProps) {
  return (
    <Box
      width="750px"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Flex>
        <ZoomableImage
          src={imageURL}
          width="640px"
          height="360px"
          objectFit="cover"
        />
      </Flex>
    </Box>
  )
}
