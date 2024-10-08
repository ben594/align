import { Box, BoxProps } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface ClickableOpacityProps extends BoxProps {
  children: ReactNode
  isDisabled?: boolean
}

const ClickableOpacity: React.FC<ClickableOpacityProps> = ({
  children,
  isDisabled,
  ...props
}) => {
  return (
    <Box
      {...props}
      cursor={isDisabled ? 'not-allowed' : 'default'}
      opacity={isDisabled ? 0.6 : 1}
      _hover={isDisabled ? {} : { opacity: 0.6 }}
      _active={isDisabled ? {} : { opacity: 0.3 }}
    >
      {children}
    </Box>
  )
}

export default ClickableOpacity
