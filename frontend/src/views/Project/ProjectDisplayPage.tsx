import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Role, canAdmin, canReview } from '../../accessControl'
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
import ProjectMetrics from '../../components/ProjectMetrics'

interface ProjectDisplayPageProps {
  projectId: string | undefined
}

export default function ProjectDisplayPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const toast = useToast()

  const ImageGrid = ({ projectId }: ProjectDisplayPageProps) => {
    const [projectImages, setProjectImages] = useState([])
    const [project, setProject] = useState<Project>()

    // get list of all images under this project
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

    // get project into
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
    }, [projectId])

    useEffect(() => {
      fetchProject()
    }, [projectId])

    const joinProject = async () => {
      const token = sessionStorage.getItem('jwt')
      try {
        // make post request to add the user as a labeler under this project
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
        toast({
          title: 'Error',
          description: 'Failed to join project.',
          status: 'error',
        })
      }

      fetchProject()
    }

    const isArchived = project?.isArchived

    return (
      <FlexColumn rowGap={4} alignItems="center">
        {isArchived && (
          <Box
            bg="yellow.100"
            borderWidth="1px"
            borderColor="yellow.300"
            p={4}
            borderRadius="md"
            textAlign="center"
          >
            <Text fontSize="sm" fontWeight="medium" color="yellow.800">
              This project has been archived by the owner. It is now read-only.
            </Text>
          </Box>
        )}
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
                tags={project.tags}
                hideButton={true}
                height="min-content"
                maxWidth="400px"
              />
            ) : (
              <Spinner />
            )}

            {canAdmin(project?.role as Role) && (
              <>
                {!isArchived && (
                  <ImageUploadWidget
                    projectId={projectId}
                    refetch={fetchImages}
                    isDisabled={!canAdmin(project?.role as Role) || isArchived}
                  />
                )}
              </>
            )}
            <ProjectMetrics projectId={projectId} />
            {canAdmin(project?.role as Role) && (
              <>
                {!isArchived && (
                  <IconButton
                    icon={<SettingsIcon />}
                    aria-label="Settings"
                    colorScheme="blue"
                    isRound
                    onClick={() => {
                      navigate(`/project/${projectId}/settings`)
                    }}
                  />
                )}
              </>
            )}
          </FlexRow>

          {project?.role == null && !isArchived ? (
            <Button colorScheme="green" onClick={joinProject}>
              Join project!
            </Button>
          ) : (
            <FlexRow columnGap={4} justifyContent="center">
              {!isArchived && (
                <>
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      navigate(`/label/${projectId}`)
                    }}
                    isDisabled={isArchived}
                  >
                    Start Labeling!
                  </Button>
                  <Button
                    isDisabled={!canReview(project?.role as Role) || isArchived}
                    colorScheme="green"
                    onClick={() => {
                      navigate(`/review/${projectId}`)
                    }}
                  >
                    Start Reviewing!
                  </Button>
                </>
              )}

              {canAdmin(project?.role as Role) && (
                <Button
                  colorScheme="blue"
                  mb="4"
                  onClick={() =>
                    navigate(`/project/${projectId}/finalized_images`)
                  }
                >
                  View Labeled Images
                </Button>
              )}
            </FlexRow>
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
