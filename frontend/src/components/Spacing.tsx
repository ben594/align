/**
 * Spacing.tsx
 *
 * This file defines a `Spacing` component that wraps the Chakra UI `Box` component
 * to provide vertical and horizontal spacing.
 *
 * Usage:
 * ```
 * <Spacing v={10} h={20} />
 * ```
 */

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
