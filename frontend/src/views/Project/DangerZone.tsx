import {
  Box,
  Button,
  Text,
  VStack,
  Card,
  CardBody,
  HStack,
  useToast,
  Tooltip,
} from '@chakra-ui/react'
import { BACKEND_URL } from '../../constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { canOwner, Role } from '../../accessControl'

interface DangerZoneProps {
  projectId: string
}

const DangerZone = ({ projectId }: DangerZoneProps) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [role, setRole] = useState('')

  const fetchProject = useCallback(async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(`${BACKEND_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRole(response.data.role)
    } catch (error) {
      console.error(error)
    }
  }, [projectId])

  useEffect(() => {
    fetchProject()
  }, [projectId])

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
        navigate(`/project/${projectId}/images`)
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
                Archive this project
              </Text>
              <Text fontSize="sm" color="gray.500">
                Mark this project as archived and read-only.
              </Text>
            </Box>
            <Tooltip
              label={
                !canOwner(role as Role)
                  ? 'You must be a project owner to archive a project.'
                  : ''
              }
            >
              <Button
                colorScheme="red"
                size="sm"
                onClick={archiveProject}
                isDisabled={!canOwner(role as Role)}
              >
                Archive
              </Button>
            </Tooltip>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default DangerZone
