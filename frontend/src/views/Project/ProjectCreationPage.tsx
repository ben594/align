import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../constants'
import Header from '../../components/Header'

export default function ProjectCreationPage() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const navigate = useNavigate()
  const toast = useToast()

  const handleFileUpload = e => {
    setUploadedFiles(Array.from(e.target.files))
  }

  const submitProject = async () => {
    if (projectName === '' || description === '' || deadline === '') {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    if (!uploadedFiles.length) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image.',
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

      uploadedFiles.forEach(file => {
        formData.append('images', file)
      })

      const response = await axios.post(
        `${BACKEND_URL}/create-project`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

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
      justifyContent="center"
      alignItems="center"
    >
      <Header />
      <Tabs variant="soft-rounded" align="start">
        <Heading>Create a New Project</Heading>
        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <VStack width="500px" height="500px">
                  <FormControl margin="8px">
                    <FormLabel>Project Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Project Name"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl margin="8px">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Describe your project"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </FormControl>
                  <FormControl margin="8px">
                    <FormLabel>Deadline</FormLabel>
                    <Input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                    />
                  </FormControl>
                  <FormControl margin="10px">
                    <FormLabel>Upload Images</FormLabel>
                    <Input type="file" multiple onChange={handleFileUpload} />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    width="150px"
                    onClick={submitProject}
                  >
                    Create Project
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
