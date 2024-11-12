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
  Flex,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react'

import { BACKEND_URL } from '../../constants'
import Header from '../../components/Header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export interface Project {
  role: string | undefined
  name: string
  description: string
  id: number
  vendorUID: number
  pricePerImage: number
}

export default function ProjectCreationPage() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerImage, setPricePerImage] = useState(0)
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([]);

  const navigate = useNavigate()
  const toast = useToast()

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag.toUpperCase()]); 
      setTag("");               
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const submitProject = async () => {
    if (projectName === '' || description === '') {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        status: 'error',
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('projectName', projectName)
      formData.append('description', description)
      formData.append('pricePerImage', pricePerImage.toString())
      formData.append('tags', JSON.stringify(tags));

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
        </Card>

        <Card width="100%">
          <CardBody>
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Flex>
                <Input
                  type="text"
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  placeholder="Provide a descriptive tag"
                />
                <Button colorScheme='blue' ml={2} onClick={handleAddTag}>Add</Button>
              </Flex>
            </FormControl>

            <HStack mt={4} spacing={2}>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  variant="solid"
                  size="sm"
                >
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(index)} />
                </Tag>
              ))}
            </HStack>

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
