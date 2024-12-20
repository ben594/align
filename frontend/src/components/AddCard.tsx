/**
 * AddCard.tsx
 *
 * This file defines an `AddCard` component that displays a card with an "Add" icon.
 * When clicked, it navigates the user to the "new project" creation page.
 */

import { Card, CardBody } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import ClickableOpacity from './ClickableOpacity'
import { useNavigate } from 'react-router-dom'

export type AddCardProps = {}

export default function AddCard({}: AddCardProps) {
  const navigate = useNavigate()

  return (
    <ClickableOpacity>
      <Card
        height="320px"
        maxHeight="320px"
        overflowY="hidden"
        cursor="pointer"
        onClick={() => {
          navigate('/new-project')
        }}
      >
        <CardBody display="flex" justifyContent="center" alignItems="center">
          <AddIcon boxSize={16} color="gray" />
        </CardBody>
      </Card>
    </ClickableOpacity>
  )
}
