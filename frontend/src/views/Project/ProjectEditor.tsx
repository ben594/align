import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import axios from 'axios'

interface ProjectEditorProps {
  projectId: string
}

const ProjectEditor = ({ projectId }: ProjectEditorProps) => {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerImage, setPricePerImage] = useState('0')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const toast = useToast()

  // get project info
  const fetchProject = useCallback(async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(`${BACKEND_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProjectName(response.data.name)
      setDescription(response.data.description)
      setPricePerImage(response.data.pricePerImage)
    } catch (error) {
      console.error(error)
    }
  }, [projectId])

  const fetchTags = useCallback(async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      // get project tags
      const response = await axios.get(
        `${BACKEND_URL}/project/${projectId}/tags`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      if (response.data && response.data.tags) {
        setTags(response.data.tags)
      }
    } catch (error) {
      console.error('Error fetching project tags:', error)
    }
  }, [projectId])

  useEffect(() => {
    fetchProject()
  }, [projectId])

  useEffect(() => {
    fetchTags()
  }, [projectId])

  const handleAddTag = () => {
    if (tag.trim() !== '' && !tags.includes(tag.toUpperCase())) {
      setTags([...tags, tag.toUpperCase()])
      setTag('')
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  // make post request to update project info
  const updateProject = async () => {
    console.log(pricePerImage)
    if (projectName === '' || description === '' || pricePerImage === '') {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        status: 'error',
      })
      return
    }

    try {
      const data = {
        project_name: projectName,
        description: description,
        price_per_image: pricePerImage,
        tags,
      }

      const token = sessionStorage.getItem('jwt')

      const response = await axios.post(
        `${BACKEND_URL}/project/${projectId}/update`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        toast({
          title: 'Project updated!',
          status: 'success',
        })
      } else {
        throw new Error('Failed to update project.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update project.',
        status: 'error',
      })
    }
  }

  return (
    <Box>
      <VStack spacing={5} width="100%" alignItems="flex-start">
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
                onChange={e => setPricePerImage(e.target.value)}
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
                <Button colorScheme="blue" ml={2} onClick={handleAddTag}>
                  Add
                </Button>
              </Flex>
            </FormControl>

            <HStack mt={4} spacing={2}>
              {tags.map((tag, index) => (
                <Tag key={index} variant="solid" size="sm">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(index)} />
                </Tag>
              ))}
            </HStack>
          </CardBody>
        </Card>

        <Box>
          <Button colorScheme="blue" width="150px" onClick={updateProject}>
            Update
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default ProjectEditor