import { Box, Button, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import FlexRow from '../../components/FlexRow'
import Header from '../../components/Header'
import ImageCard from '../../components/ImageCard'
import ImageUploadWidget from './ImageUploadWidget'
import { Project } from './ProjectCreationPage'
import ProjectCard from '../../components/ProjectCard'
import { SettingsIcon } from '@chakra-ui/icons'
import axios from 'axios'
import useRerender from '../../hooks/useRerender'

interface ProjectDisplayPageProps {
  projectId: string | undefined
}

export default function ProjectDisplayPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()

  // TODO Only display start labeling / reviewing buttons when images have been uploaded

  const ImageGrid = ({ projectId }: ProjectDisplayPageProps) => {
    const [fetchImagesDep, fetchImagesTrigger] = useRerender()

    const [projectImages, setProjectImages] = useState([])
    const [project, setProject] = useState<Project>()

    const fetchImages = useCallback(async () => {
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
    }, [projectId])

    const fetchProject = useCallback(async () => {
      const token = sessionStorage.getItem('jwt')
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
    }, [projectId])

    useEffect(() => {
      fetchImages()
    }, [projectId, fetchImagesDep])

    useEffect(() => {
      fetchProject()
    }, [projectId])

    const joinProject = async () => {
      const token = sessionStorage.getItem('jwt')
      try {
        await axios.post(
          `${BACKEND_URL}/project/${projectId}/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } catch (error) {
        console.error(error)
      }

      fetchProject()
    }

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

            {project?.role == 'owner' && (
              <>
                <ImageUploadWidget
                  projectId={projectId}
                  rerender={fetchImagesTrigger}
                  isDisabled={project?.role !== 'owner'}
                />
                <IconButton
                  icon={<SettingsIcon />}
                  aria-label="Settings"
                  colorScheme="blue"
                  isRound
                  onClick={() => {
                    navigate(`/project/${projectId}/settings`)
                  }}
                />
              </>
            )}
          </FlexRow>

          {project?.role == null ? (
            <Button colorScheme="green" onClick={joinProject}>
              Join project!
            </Button>
          ) : (
            <>
              <Button
                colorScheme="green"
                onClick={() => {
                  navigate(`/label/${projectId}`)
                }}
              >
                Start Labeling!
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  navigate(`/review/${projectId}`)
                }}
              >
                Start Reviewing!
              </Button>
            </>
          )}
        </FlexColumn>

        <SimpleGrid columns={[2, null, 4]} spacing="40px">
          {projectImages.map((image: any, index: number) => (
            <ImageCard
              key={index}
              image_url={image.image_url}
              label={image.label}
              tags={[
                image.labeled_status ? 'Labeled' : 'Not Labeled',
                image.accepted_status ? 'Accepted' : 'Not Accepted',
              ]}
            />
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
