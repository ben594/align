import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  Heading,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'

import { Project } from '../views/Project/ProjectCreationPage'
import { useNavigate } from 'react-router-dom'

interface ProjectCardProps extends Omit<CardProps, 'id'> {
  role: string
  name: string
  description: string
  id: number
  vendorUID: number
  pricePerImage: number
  hideButton?: boolean
}

export default function ProjectCard({
  role,
  name,
  description,
  id,
  vendorUID,
  pricePerImage,
  hideButton,
  ...cardProps
}: ProjectCardProps) {
  const navigate = useNavigate()

  return (
    <Card height="300px" {...cardProps}>
      <CardBody>
        <Stack>
          <Heading size="xl" textAlign="left">
            {name}
          </Heading>
          <Text
            textAlign="left"
            overflow="scroll"
            textOverflow="ellipsis"
            height="100px"
          >
            {description}
          </Text>
          <Tag width="fit-content">{role}</Tag>
        </Stack>
      </CardBody>
      {!hideButton && (
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                navigate(`/project/${id}/images`)
              }}
            >
              View Info
            </Button>
          </ButtonGroup>
        </CardFooter>
      )}
    </Card>
  )
}
