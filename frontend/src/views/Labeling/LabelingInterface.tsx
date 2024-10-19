import { Box, Button, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageScroller from './ImageScroller'
import Header from '../../components/Header'
import FlexRow from '../../components/FlexRow'
import ImageViewer from './ImageViewer'

export interface Image {
  
}

export default function LabelingInterface() {
  const { projectId } = useParams()
  const [image, setImage] = useState(null)
  const [label, setLabel] = useState('')

  const submitLabel = async () => {
    setLabel('')
    return
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
      <ImageViewer imageURL={image} />
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
