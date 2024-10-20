import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'

import { BACKEND_URL } from '../../constants'
import Header from '../../components/Header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export interface Project {
  role: string
  name: string
  description: string
  deadline: string | null
  id: number
  vendorUID: number
  pricePerImage: number
}

export default function ProjectCreationPage() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [pricePerImage, setPricePerImage] = useState(0)

  const navigate = useNavigate()
  const toast = useToast()

  const submitProject = async () => {
    if (projectName === '' || description === '') {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('projectName', projectName)
      formData.append('description', description)
      formData.append('deadline', deadline)
      formData.append('pricePerImage', pricePerImage.toString())

      const token = sessionStorage.getItem('jwt')

      const response = await axios.post(`${BACKEND_URL}/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Project created successfully!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        navigate('/dashboard')
      } else {
        throw new Error('Failed to create project.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      overflowY="auto"
    >
      <Header />
      <Box>
        <Heading alignSelf="flex-start" paddingLeft="40px" paddingTop="20px">
          Create a New Project
        </Heading>
      </Box>
      <VStack
        spacing={5}
        width="100%"
        maxWidth="800px"
        alignItems="flex-start"
        padding="40px"
      >
        <Card width="100%">
          <CardBody>
            <FormControl isRequired>
              <FormLabel>Project Name</FormLabel>
              <Input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
              />
            </FormControl>
          </CardBody>
          <CardBody>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe your project"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </FormControl>
          </CardBody>
        </Card>

        <Card width="100%">
          <CardBody>
            <FormControl isRequired>
              <FormLabel>Price per Image (USD)</FormLabel>
              <Input
                type="number"
                value={pricePerImage}
                onChange={e =>
                  setPricePerImage(e.target.value as unknown as number)
                }
              />
            </FormControl>
          </CardBody>
          <CardBody>
            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </FormControl>
          </CardBody>
        </Card>

        <Box>
          <Button colorScheme="blue" width="150px" onClick={submitProject}>
            Create Project
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}
