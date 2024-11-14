import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import { CloseIcon } from '@chakra-ui/icons'
import FlexRow from '../../components/FlexRow'
import { Spacing } from '../../components/Spacing'
import axios from 'axios'

// TODO: integrate with backend

interface RoleManagerProps {
  projectId: string | undefined
}

type Role = 'owner' | 'reviewer' | 'labeler' | 'admin'

const DEFAULT_ROLE: Role = 'labeler'

interface User {
  id: number
  name: string
  email: string
  role: Role
}

const RoleManager = ({ projectId }: RoleManagerProps) => {
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

  useEffect(() => {
    fetchUsers()
  }, [projectId])

  // State for new user inputs
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<Role>(DEFAULT_ROLE)

  const handleRoleChange = (id: number, newRole: Role) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      )
    )
  }

  const handleRemoveUser = (id: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
  }

  const handleAddUser = () => {
    // TODO: get from db
    if (newEmail.trim()) {
      const newUser = {
        id: Date.now(),
        name: newEmail.split('@')[0], // Placeholder name based on email
        email: newEmail,
        role: newRole,
      }
      setUsers([...users, newUser])
      setNewEmail('') // Clear the input fields
      setNewRole(DEFAULT_ROLE)
    }
  }

  return (
    <Card>
      <CardBody>
        <Heading size="md" textAlign="center">
          Manage Project Members
        </Heading>
        <Spacing v={16} />
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
                        <option value="owner">Owner</option>
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
                  <Button colorScheme="green" size="sm" onClick={handleAddUser}>
                    Add
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
}

export default RoleManager
