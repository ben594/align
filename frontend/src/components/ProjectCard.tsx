/**
 * ProjectCard.tsx
 *
 * This file defines a `ProjectCard` component that displays information about a project,
 * including its name, description, price per image, and tags. It also provides buttons
 * for interacting with the project, such as viewing details or performing actions based
 * on the user's role.
 */

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  HStack,
  Heading,
  Stack,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { BACKEND_URL } from '../constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FlexRow from './FlexRow'

interface ProjectCardProps extends Omit<CardProps, 'id'> {
  role: string | undefined
  name: string
  description: string
  id: number
  vendorUID: number
  pricePerImage: number
  hideButton?: boolean
  isArchived?: boolean
  tags: Array<string>
}

export default function ProjectCard({
  role,
  name,
  description,
  id,
  vendorUID,
  pricePerImage,
  hideButton,
  tags,
  isArchived,
  ...cardProps
}: ProjectCardProps) {
  const navigate = useNavigate()
  const [vendorName, setVendorName] = useState(null)

  const fetchVendorInfo = async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(
        `${BACKEND_URL}/profile/${vendorUID}/user_name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      if (response.data) {
        setVendorName(response.data)
      }
    } catch (error) {
      console.error('Error fetching vendor name:', error)
    }
  }

  useEffect(() => {
    fetchVendorInfo()
  }, [id, vendorUID])

  return (
    <Card
      height="320"
      maxHeight="320px"
      overflowY="auto"
      {...cardProps}
      backgroundColor={isArchived ? 'gray.50' : undefined}
    >
      <CardBody>
        <Stack>
          <FlexRow gap={2}>
            {isArchived && (
              <Tag colorScheme="yellow" width="fit-content">
                Archived
              </Tag>
            )}
            {role && (
              <Tag colorScheme="red" width="fit-content">
                {role}
              </Tag>
            )}
          </FlexRow>
          <Heading size="xl" textAlign="left">
            {name}
          </Heading>

          <HStack spacing={2}>
            {tags.map((tag, index) => (
              <Tag key={index} variant="solid" size="sm">
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </HStack>
          {vendorName && (
            <Tag
              cursor="pointer"
              onClick={() => navigate(`/profile/${vendorUID}`)}
              width="fit-content"
            >
              <TagLabel>{vendorName}</TagLabel>
            </Tag>
          )}
          <Text
            textAlign="left"
            overflow="auto"
            textOverflow="ellipsis"
            fontWeight="bold"
          >
            {description}
          </Text>
          <Text textAlign="left">Payment per image: ${pricePerImage}</Text>
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
