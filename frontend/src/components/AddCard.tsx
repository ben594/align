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
        height="300px"
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
