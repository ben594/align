import { Box, Button, Textarea, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import FlexRow from '../../components/FlexRow'
import ImageViewer from './ImageViewer'
import axios from 'axios'
import { BACKEND_URL } from '../../constants'

export interface Image {
  imageID: string
  imageURL: string
  projectID: string
  labeledStatus: boolean
  acceptedStatus: boolean
  labelerUID: number
  labelText: string
}

export default function ReviewingInterface() {
  const { projectId } = useParams()
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [reviewFeedback, setFeedback] = useState('')

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getNextImage()
  }, [])

  useEffect(() => {

  })

  const approveLabel = async () => {
    try {
      const token = sessionStorage.getItem('jwt')
      const formData = new FormData()
      formData.append('projectID', projectId ?? '')
      formData.append('imageURL', imageURL ?? '')

      const response = await axios.post(`${BACKEND_URL}/approve_label`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Label approved successfully!',
          status: 'success',
        })
        getNextImage()
      } else {
        throw new Error('Failed to approve label.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve label.',
        status: 'error',
      })
    }
  }

  // TODO rejectLabel
  const rejectLabel = async () => {

  }

  const getNextImage = async () => {
    const token = sessionStorage.getItem('jwt')

    try {
      const response = await axios.get(
        `${BACKEND_URL}/images/next/review/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('response: ', response)

      if (response.status === 201 || response.status === 200) {
        setImageURL(response.data.imageURL)
        setFeedback('')
        // Get this image's pending label
        setLabel(response.data.labelText)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No more images to review for this project.',
        status: 'error',
      })
      navigate(`/project/${projectId}/images`)
      return
    }
  }

  // TODO: in the future we can make the label text editable
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="column"
    >
      <Header />
      <ImageViewer imageURL={imageURL} />
      <Box marginTop="50px" width="50vw" textAlign="center">
        <text>{label}</text>
        <FlexRow
          width="100%"
          columnGap={1}
          marginTop="20px"
          justifyContent="center"
        >
          <Button width="100px" colorScheme="green" onClick={approveLabel}>
            Approve
          </Button>
          
          <Box marginTop="50px" width="50vw">
          <Textarea
            placeholder="Minor edits to the label needed but approved"
            value={label}
            onChange={e => setLabel(e.target.value)}
          />
          <FlexRow
            width="100%"
            columnGap={1}
            marginTop="20px"
            justifyContent="center"
          >
            <Button width="100px" colorScheme="green" onClick={approveLabel}>
              Approve
            </Button>

          </FlexRow>
        </Box>

          <Box marginTop="50px" width="50vw">
          <Textarea
            placeholder="Please provide rejection feedback"
            value={reviewFeedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <FlexRow
            width="100%"
            columnGap={1}
            marginTop="20px"
            justifyContent="center"
          >
            <Button width="100px" colorScheme="red" onClick={rejectLabel}>
              Reject
            </Button>
          </FlexRow>
        </Box>
        </FlexRow>
      </Box>
    </Box>
  )
}
