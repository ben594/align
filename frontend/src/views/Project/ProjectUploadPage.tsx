import { Box, Button, Input, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const UploadImages: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(
    undefined
  )
  const toast = useToast()

  // TODO: confirm current user has permission to upload images to this projectId
  const { projectId } = useParams()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files)
    }
  }

  const submitImages = async () => {
    // Check if no files were uploaded
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image.',
        status: 'error',
      })
      return
    }

    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach(file => {
        formData.append('images', file)
      })

      // Send the POST request to upload images
      // TODO: maybe show the uploaded images in the UI?
      const response = await axios.post(
        `${BACKEND_URL}/project/${projectId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
          },
        }
      )

      toast({
        title: 'Images uploaded successfully!',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images.',
        status: 'error',
      })
    }
  }

  return (
    <Box p={8} borderWidth="1px" boxShadow="lg" maxW="lg">
      <Text fontSize="xl" fontWeight="semibold" mb={6} textAlign="center">
        Upload Images
      </Text>

      <FlexColumn rowGap={2}>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          size="lg"
          pt={2}
        />

        <Button colorScheme="teal" size="lg" onClick={submitImages}>
          Upload
        </Button>
      </FlexColumn>
    </Box>
  )
}

export default UploadImages
