import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Project } from '../views/Project/ProjectCreationPage'

export default function ProjectCard({
  name,
  description,
  deadline,
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
          <Text textAlign="left" overflow="hidden" textOverflow="ellipsis">
            {description}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Join Project
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
