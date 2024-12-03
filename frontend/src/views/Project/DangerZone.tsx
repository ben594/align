import {
  Box,
  Button,
  Text,
  VStack,
  Card,
  CardBody,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { BACKEND_URL } from '../../constants'
import axios from 'axios'

interface DangerZoneProps {
  projectId: string
}

const DangerZone = ({ projectId }: DangerZoneProps) => {
  const toast = useToast()

  const archiveProject = async () => {
    try {
      const token = sessionStorage.getItem('jwt')

      const response = await axios.post(
        `${BACKEND_URL}/project/${projectId}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        toast({
          title: 'Project archived successfully!',
          status: 'success',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive project.',
        status: 'error',
      })
    }
  }

  return (
    <Card>
      <CardBody>
        <VStack align="stretch">
          <HStack justify="space-between">
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={1}>
                Archive this repository
              </Text>
              <Text fontSize="sm" color="gray.500">
                Mark this project as archived and read-only.
              </Text>
            </Box>
            <Button colorScheme="red" size="sm" onClick={archiveProject}>
              Archive this repository
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default DangerZone
