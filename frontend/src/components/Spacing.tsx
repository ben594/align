import { Box, BoxProps } from '@chakra-ui/react'

import React from 'react'

interface SpacingProps extends BoxProps {
  v?: number
  h?: number
}

export const Spacing: React.FC<SpacingProps> = ({
  v,
  h,
  ...props
}: SpacingProps) => {
  return <Box style={{ marginTop: v, marginRight: h }} {...props} />
}
