import { Box, Button, SimpleGrid, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import FlexRow from '../../components/FlexRow'
import Header from '../../components/Header'
import ImageUploadWidget from './ImageUploadWidget'
import { Project } from './ProjectCreationPage'
import ProjectCard from '../../components/ProjectCard'
import ZoomableImage from '../../components/ZoomableImage'
import axios from 'axios'

interface ProjectDisplayPageProps {
  projectId: string | undefined
}

export default function ProjectDisplayPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()

  const ImageGrid = ({ projectId }: ProjectDisplayPageProps) => {
    const [projectImages, setProjectImages] = useState<String[]>([])
    const [project, setProject] = useState<Project>()

    useEffect(() => {
      const fetchImages = async () => {
        const token = sessionStorage.getItem('jwt')
        try {
          const response = await axios.get(
            `${BACKEND_URL}/project/${projectId}/images`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setProjectImages(response.data)
        } catch (error) {
          console.error(error)
        }
      }
      fetchImages()
    }, [projectId])

    useEffect(() => {
      const token = sessionStorage.getItem('jwt')
      const fetchProject = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/projects/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setProject(response.data)
        } catch (error) {
          console.error(error)
        }
      }
      fetchProject()
    }, [projectId])

    return (
      <FlexColumn rowGap={4} alignItems="center">
        <FlexColumn rowGap={4} maxWidth="1000px">
          <FlexRow columnGap={4}>
            {project ? (
              <ProjectCard
                name={project.name}
                description={project.description}
                id={project.id}
                vendorUID={project.vendorUID}
                pricePerImage={project.pricePerImage}
                role={project.role}
                hideButton={true}
                height="min-content"
                maxWidth="400px"
              />
            ) : (
              <Spinner />
            )}

            <ImageUploadWidget
              projectId={projectId}
              setProjectImages={setProjectImages}
            />
          </FlexRow>
          <Button
            colorScheme="green"
            onClick={() => {
              navigate(`/label/${projectId}`)
            }}
          >
            Start Labeling!
          </Button>
        </FlexColumn>
        <SimpleGrid columns={[2, null, 4]} spacing="40px">
          {projectImages.map((image_url: any, index: number) => (
            <Box key={index}>
              <ZoomableImage src={image_url} w="100%" h="100%" fit="cover" />
            </Box>
          ))}
        </SimpleGrid>
      </FlexColumn>
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
