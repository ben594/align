import { Box, Image, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import Header from '../../components/Header'
import axios from 'axios'
import { useParams } from 'react-router-dom'

interface ProjectDisplayPageProps {
  projectId: string | undefined
}

export default function ProjectDisplayPage() {
  const { projectId } = useParams()

  const ImageGrid = ({ projectId }: ProjectDisplayPageProps) => {
    const [projectImages, setProjectImages] = useState([])

    useEffect(() => {
      const fetchImages = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/project/${projectId}/images`
          )
          setProjectImages(response.data)
        } catch (error) {
          console.error(error)
        }
      }
      fetchImages()
    }, [projectId])

    return (
      <SimpleGrid columns={[2, null, 4]} spacing="40px">
        {projectImages.map((image_url: any, index: number) => (
          <Box key={index}>
            <Image src={image_url} w="100%" h="100%" />
          </Box>
        ))}
      </SimpleGrid>
    )
  }

  // TODO @jamie: make the grid look nicer and add onclick images direct to labeling page

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      overflowY="auto"
    >
      <Header />
      <ImageGrid projectId={projectId} />
    </Box>
  )
}
