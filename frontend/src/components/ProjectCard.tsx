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
  HStack,
  TagLabel,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../constants'

import { useNavigate } from 'react-router-dom'

interface ProjectCardProps extends Omit<CardProps, 'id'> {
  role: string | undefined
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
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      const token = sessionStorage.getItem('jwt')
      try {
        const response = await axios.get(`${BACKEND_URL}/project/${id}/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        console.log(response.data)
        if (response.data && response.data.tags) {
          setTags(response.data.tags)
        }
      } catch (error) {
        console.error('Error fetching project tags:', error)
      }
    }
    fetchTags()
  }, [id])

  return (
    <Card height="300px" {...cardProps}>
      <CardBody>
        <Stack>
          {role && <Tag colorScheme='red' width="fit-content">{role}</Tag>}
          <Heading size="xl" textAlign="left">
            {name}
          </Heading>

          <HStack spacing={2}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                variant="solid"
                size="sm"
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </HStack>

          <Text
            textAlign="left"
            overflow="scroll"
            textOverflow="ellipsis"
          >
            {description}
          </Text>

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
