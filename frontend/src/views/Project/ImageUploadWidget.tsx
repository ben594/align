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
  rerender?: () => void
  isDisabled?: boolean
}

const ImageUploadWidget = ({
  isDisabled,
  projectId,
  rerender,
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

      rerender?.()

      toast({
        title: 'Images uploaded successfully!',
        status: 'success',
      })

      // Get price per image for this project
      const pricePerImage = await axios.get(
        `${BACKEND_URL}/project/${projectId}/get_project_ppi`
      )
      const totalPrice = (selectedFiles?.length ?? 0) * pricePerImage.data

      // User must pay if images successfuly uploaded

      // TODO: this doesn't seem safe -- should probably get user_id from the backend using the (signed) jwt instead of from sessionStorage
      try {
        await axios.post(
          `${BACKEND_URL}/subtract_from_balance/${user_id}/${totalPrice}`
        )
        console.log('Balance deducted successfully.')
      } catch (error) {
        console.error('Error deducting balance:', error)
      }
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
