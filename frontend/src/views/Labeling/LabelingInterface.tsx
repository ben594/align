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

export default function LabelingInterface() {
  const { projectId } = useParams()
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const hasCalledGetImage = useRef(false);

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasCalledGetImage.current) {
      getNextImage()
      hasCalledGetImage.current = true
    }
  }, [])

  // make API call to submit label for current image
  const submitLabel = async () => {
    if (label === '') {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        status: 'error',
      })
      return
    }

    // first check if label has profanity
    const profanityCheck = async () => {
      const res = await fetch('https://vector.profanity.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: label }),
      }).then(async (data) => {
        const json = await data.json()
        if (json.isProfanity) {
          toast({
            title: 'Error',
            description: 'Label rejected due to profanity.',
            status: 'error',
          })
          throw new Error('Label rejected due to profanity.')
        }
      })
    }

    await profanityCheck()

    try {
      const formData = new FormData()
      formData.append('projectID', projectId ?? '')
      formData.append('imageURL', imageURL ?? '')
      formData.append('label', label)

      const token = sessionStorage.getItem('jwt')

      const response = await axios.post(`${BACKEND_URL}/label`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Label submitted successfully!',
          status: 'success',
        })
        getNextImage()
      } else {
        throw new Error('Failed to submit label.')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit label.',
        status: 'error',
      })
    }
  }

  // make API call to get next unlabeled image in the project
  const getNextImage = async () => {
    const token = sessionStorage.getItem('jwt')

    try {
      const response = await axios.get(
        `${BACKEND_URL}/images/next/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('response: ', response)

      if (response.status === 201 || response.status === 200) {
        setImageURL(response.data.imageURL)
        setLabel('')
        return
      }
    } catch {
      toast({
        title: 'Info',
        description: 'No more images to label for this project.',
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
      <Box marginTop="50px" width="50vw">
        <Textarea
          placeholder="What is this image of?"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
        <FlexRow
          width="100%"
          columnGap={1}
          marginTop="20px"
          justifyContent="center"
        >
          <Button width="100px" colorScheme="blue" onClick={submitLabel}>
            Submit
          </Button>
        </FlexRow>
      </Box>
    </Box>
  )
}
