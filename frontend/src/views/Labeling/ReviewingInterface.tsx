import { Box, Button, Textarea, useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
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
  const [labelerID, setLabelerID] = useState<number | null>(null)
  const [label, setLabel] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [reviewFeedback, setFeedback] = useState('')
  const hasCalledGetImage = useRef(false)

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasCalledGetImage.current) {
      // get image on load
      getNextImage()
      hasCalledGetImage.current = true
    }
  }, [])

  // make API call to mark label as approved
  const approveLabel = async () => {
    try {
      const token = sessionStorage.getItem('jwt')
      const formData = new FormData()
      formData.append('projectID', projectId ?? '')
      formData.append('imageURL', imageURL ?? '')

      const response = await axios.post(
        `${BACKEND_URL}/approve_label`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Label approved successfully!',
          status: 'success',
        })

        // on success, automatically fetch next image
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

  const rejectLabel = async () => {
    try {
      const token = sessionStorage.getItem('jwt')
      const formData = new FormData()
      formData.append('projectID', projectId ?? '')
      formData.append('imageURL', imageURL ?? '')

      const response = await axios.post(
        `${BACKEND_URL}/reject_label`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Label rejected successfully!',
          status: 'success',
        })
        getNextImage()
      } else {
        throw new Error('Failed to reject label.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject label.',
        status: 'error',
      })
    }
  }

  const updateLabel = async () => {
    try {
      const token = sessionStorage.getItem('jwt')
      const formData = new FormData()
      formData.append('projectID', projectId ?? '')
      formData.append('imageURL', imageURL ?? '')
      formData.append('newLabel', newLabel ?? '')

      const response = await axios.post(
        `${BACKEND_URL}/update_finalize_label`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Label updated and finalized successfully!',
          status: 'success',
        })
        getNextImage()
      } else {
        throw new Error('Failed to update label.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update label.',
        status: 'error',
      })
    }
  }

  // make API call to get next unreviewed image in the project
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

      if (response.status === 201 || response.status === 200) {
        setImageURL(response.data.imageURL)
        setLabelerID(response.data.labelerUID)
        setFeedback('')
        // Get this image's pending label
        setNewLabel('')
        setLabel(response.data.labelText)
      }
    } catch {
      toast({
        title: 'Info',
        description: 'No more images to review for this project.',
        status: 'info',
      })
      navigate(`/project/${projectId}/images`)
      return
    }
  }

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
        <Textarea
          value={newLabel !== '' ? newLabel : label}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              updateLabel()
            }
          }}
          width="100%"
          height="10px"
          marginBottom="20px"
        />
        <FlexRow
          width="100%"
          columnGap={1}
          marginTop="20px"
          justifyContent="center"
        >
          <Button
            width="100px"
            colorScheme="green"
            onClick={() => {
              const numChanges = newLabel.length - label.length
              if (newLabel !== null && newLabel !== '' && numChanges > 15) {
                toast({
                  title: 'Error',
                  description:
                    'Too many changes. Please reject label and try again',
                  status: 'error',
                })
              } else if (
                newLabel !== null &&
                newLabel !== '' &&
                numChanges < 15
              ) {
                updateLabel()
              } else {
                approveLabel()
              }
            }}
          >
            Approve
          </Button>
          <Button width="100px" colorScheme="red" onClick={rejectLabel}>
            Reject
          </Button>
        </FlexRow>
      </Box>
    </Box>
  )
}
