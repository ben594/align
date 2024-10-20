import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'

import { Project } from '../views/Project/ProjectCreationPage'

export default function ProjectCard({
  role,
  name,
  description,
  id,
  vendorUID,
  pricePerImage,
  totalNumImages,
}: Project) {
  return (
    <Card height="300px">
      <CardBody>
        <Stack>
          <Heading size="xl" textAlign="left">
            {name}
          </Heading>
          <Text
            textAlign="left"
            overflow="hidden"
            textOverflow="ellipsis"
            height="100px"
          >
            {description}
          </Text>
          <Tag width="fit-content">{role}</Tag>
        </Stack>
      </CardBody>
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            View Info
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
