import { Box, Button, Textarea, useToast } from '@chakra-ui/react'
import { useState } from 'react'
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
  const [imageURL, setImageURL] = useState(null)
  const [label, setLabel] = useState('')

  const toast = useToast()
  const navigate = useNavigate()

  const submitLabel = async () => {
    setLabel('')
    getNextImage()
    return
  }

  const getNextImage = async () => {
    const token = sessionStorage.getItem('jwt')

    const response = await axios.get(
      `${BACKEND_URL}/images/next/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.status === 201 || response.status === 200) {
      setImageURL(response.data.imageURL)
      return
    } else {
      toast({
        title: 'Error',
        description: 'Failed to get next image in this project.',
        status: 'error',
      })
      navigate('/dashboard')
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
