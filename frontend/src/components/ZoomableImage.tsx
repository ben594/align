import { Box, Button, Image, ImageProps } from '@chakra-ui/react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { useState } from 'react'

// Wrapper around Chakra UI Image component that adds zoom/pan functionality
// A reset button is displayed when the image is zoomed in
const ZoomableImage = (imageProps: ImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleZoomChange = ({ scale }: { scale: number }) => {
    setIsZoomed(scale !== 1)
  }

  return (
    <TransformWrapper
      onZoom={ref => handleZoomChange(ref.state)}
      onPanning={ref => handleZoomChange(ref.state)}
    >
      {({ resetTransform }) => (
        <Box position="relative">
          <TransformComponent>
            <Image fit="contain" {...imageProps} />
          </TransformComponent>
          {isZoomed && (
            <Button
              position="absolute"
              top="2"
              left="2"
              colorScheme="gray"
              onClick={() => {
                resetTransform()
                setIsZoomed(false)
              }}
            >
              Reset
            </Button>
          )}
        </Box>
      )}
    </TransformWrapper>
  )
}

export default ZoomableImage