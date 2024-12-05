/**
 * FlexColumn.tsx
 *
 * This file defines a `FlexColumn` component that wraps the Chakra UI `Flex` component
 * to enforce a column direction for its children.
 */

import { Flex, FlexProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

const FlexColumn = forwardRef(
  ({ children, ...props }: FlexProps, ref): JSX.Element => {
    return (
      <Flex direction="column" ref={ref} {...props}>
        {children}
      </Flex>
    )
  }
)
FlexColumn.displayName = 'FlexColumn'

export default FlexColumn
