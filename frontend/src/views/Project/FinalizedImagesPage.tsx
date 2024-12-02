import { Box, Button, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react'
import { Role, canAdmin, canReview } from '../../accessControl'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import FlexRow from '../../components/FlexRow'
import Header from '../../components/Header'
import ImageCard from '../../components/ImageCard'
import { Project } from './ProjectCreationPage'
import axios from 'axios'

interface FinalizedImagesPageProps {
    projectId: string | undefined
}

export default function FinalizedImagesPage() {
    const { projectId } = useParams()

    const ImageGrid = ({ projectId }: FinalizedImagesPageProps) => {
        const [finalizedImages, setFinalizedImages] = useState([])
        const [project, setProject] = useState<Project>()

        const fetchFinalizedImages = useCallback(async () => {
            const token = sessionStorage.getItem('jwt')
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/project/${projectId}/finalized_images`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setFinalizedImages(response.data)
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
            fetchFinalizedImages()
        }, [projectId])

        useEffect(() => {
            fetchProject()
        }, [projectId])

        console.log(finalizedImages);

        return (
            <SimpleGrid columns={[2, null, 4]} spacing="40px">
                {finalizedImages.map((image: any, index: number) => (
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