import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

export type ProjectCardInfo = {
  name: string;
  description: string;
  deadline: string | null;
};

export default function ProjectCard({
  name,
  description,
  deadline,
}: ProjectCardInfo) {
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
  );
}
