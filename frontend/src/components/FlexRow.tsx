/**
 * FlexRow.tsx
 *
 * This file defines a `FlexRow` component that wraps the Chakra UI `Flex` component
 * to enforce a row direction for its children.
 */

import { Flex, FlexProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

const FlexRow = forwardRef(
  ({ children, ...props }: FlexProps, ref): JSX.Element => {
    return (
      <Flex direction="row" ref={ref} {...props}>
        {children}
      </Flex>
    )
  }
)
FlexRow.displayName = 'FlexRow'

export default FlexRow
