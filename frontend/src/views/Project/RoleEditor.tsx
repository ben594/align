import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import { CloseIcon } from '@chakra-ui/icons'
import FlexRow from '../../components/FlexRow'
import { Role } from '../../accessControl'
import { Spacing } from '../../components/Spacing'

interface RoleManagerProps {
  projectId: string
}

const DEFAULT_ROLE: Role = 'labeler'

interface User {
  id: number
  name: string
  email: string
  role: Role
}

// TODO: flow is not great if a user removes themselves from a project (or downgrades their role)
// The page should probably redirect

const RoleEditor = ({ projectId }: RoleManagerProps) => {
  const toast = useToast()

  // Current list of users on the project
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'labeler' },
  ])

  const fetchUsers = useCallback(async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(
        `${BACKEND_URL}/project/${projectId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUsers(response.data)
    } catch (error) {
      console.error(error)
    }
  }, [projectId])

  const updateRole = useCallback(
    async (userId: number, projectId: string, roleName: string) => {
      const token = sessionStorage.getItem('jwt')
      try {
        const response = await axios.post(
          `${BACKEND_URL}/roles/update`,
          {
            user_id: userId,
            project_id: projectId,
            role_name: roleName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.status === 200) {
          toast({
            title: 'Updated role.',
            status: 'success',
          })
        } else {
          console.error('Failed to update role')
        }
      } catch (error) {
        console.error(error)
      }
    },
    []
  )

  const deleteRole = useCallback(async (userId: number, projectId: string) => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.post(
        `${BACKEND_URL}/roles/delete`,
        {
          user_id: userId,
          project_id: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        toast({
          title: 'Removed member.',
          status: 'success',
        })
      } else {
        console.error('Failed to delete role')
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const createRole = useCallback(
    async (email: string, projectId: string, roleName: string) => {
      const token = sessionStorage.getItem('jwt')
      try {
        const response = await axios.post(
          `${BACKEND_URL}/roles/create`,
          {
            email,
            project_id: projectId,
            role_name: roleName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Added member.',
            status: 'success',
          })
        }
      } catch (error) {
        console.error(error)

        const description =
          error instanceof AxiosError && error.response?.data?.error
            ? error.response.data.error
            : 'Failed to create role.'
        toast({ title: 'Error', description, status: 'error' })
      }
    },
    []
  )

  useEffect(() => {
    fetchUsers()
  }, [projectId])

  // State for new user inputs
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<Role>(DEFAULT_ROLE)

  const handleRoleChange = (id: number, newRole: Role) => {
    updateRole(id, projectId, newRole).then(fetchUsers)
  }

  const handleRemoveUser = (id: number) => {
    deleteRole(id, projectId).then(fetchUsers)
  }

  const handleAddUser = () => {
    // TODO: get from db
    createRole(newEmail, projectId, newRole).then(fetchUsers)
    setNewEmail('') // Clear the input fields
    setNewRole(DEFAULT_ROLE)
  }

  return (
    <Card>
      <CardBody>
        <Box>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {user.role == 'owner' ? (
                      <Select isDisabled size="sm">
                        <option value="owner">Owner</option>
                      </Select>
                    ) : (
                      <Select
                        value={user.role}
                        onChange={e =>
                          handleRoleChange(user.id, e.target.value as Role)
                        }
                        size="sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="labeler">Labeler</option>
                      </Select>
                    )}
                  </Td>
                  <Td>
                    <FlexRow justifyContent="center">
                      {user.role == 'owner' ? (
                        <IconButton
                          isDisabled
                          icon={<CloseIcon />}
                          aria-label="Remove user"
                          size="sm"
                          colorScheme="red"
                        />
                      ) : (
                        <IconButton
                          icon={<CloseIcon />}
                          aria-label="Remove user"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRemoveUser(user.id)}
                        />
                      )}
                    </FlexRow>
                  </Td>
                </Tr>
              ))}

              {/* Last row is input for adding user */}
              <Tr>
                <Td colSpan={2}>
                  <Input
                    placeholder="Email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    size="sm"
                  />
                </Td>
                <Td>
                  <Select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as Role)}
                    size="sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="labeler">Labeler</option>
                  </Select>
                </Td>
                <Td>
                  <FlexRow justifyContent="center">
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={handleAddUser}
                    >
                      Add
                    </Button>
                  </FlexRow>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
}

export default RoleEditor