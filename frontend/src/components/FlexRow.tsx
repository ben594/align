import { Flex, FlexProps } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

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
