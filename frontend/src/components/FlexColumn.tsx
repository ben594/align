import { Flex, FlexProps } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

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
