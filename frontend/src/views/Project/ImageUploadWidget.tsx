import {
  Button,
  Card,
  CardBody,
  Heading,
  Input,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import axios from 'axios'

interface ImageUploadWidgetProps {
  projectId: string | undefined
  refetch?: () => void
  isDisabled?: boolean
}

const ImageUploadWidget = ({
  isDisabled,
  projectId,
  refetch,
}: ImageUploadWidgetProps) => {
  const user_id = sessionStorage.getItem('user_id')
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(
    undefined
  )
  const toast = useToast()

  // TODO: confirm current user has permission to upload images to this projectId

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

      refetch?.()

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
    <Card>
      <CardBody>
        <Heading fontSize="xl" mb={6} textAlign="center">
          Upload Images
        </Heading>

        <FlexColumn rowGap={2}>
          <Input
            isDisabled={isDisabled}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            size="md"
            pt={1}
          />

          <Spacer />

          <Button
            isDisabled={isDisabled}
            colorScheme="blue"
            size="md"
            onClick={submitImages}
          >
            Upload
          </Button>
        </FlexColumn>
      </CardBody>
    </Card>
  )
}

export default ImageUploadWidget
