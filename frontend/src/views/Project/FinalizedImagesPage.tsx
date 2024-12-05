import { Box, Button, SimpleGrid, useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import FlexColumn from '../../components/FlexColumn'
import Header from '../../components/Header'
import ImageCard from '../../components/ImageCard'
import axios from 'axios'

interface FinalizedImagesPageProps {
    projectId: string | undefined
}

export default function FinalizedImagesPage() {
    const { projectId } = useParams()

    const ImageGrid = ({ projectId }: FinalizedImagesPageProps) => {
        const [finalizedImages, setFinalizedImages] = useState([])
        const toast = useToast()

        // get all labeled and approved images to display
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

        useEffect(() => {
            fetchFinalizedImages()
        }, [projectId])

        return (
            <FlexColumn rowGap={4} maxWidth="1000px" alignItems="center">
                <Button
                    width="500px" colorScheme="blue"
                    onClick={() => {
                        // download image urls and labels into a csv
                        const csvData = [
                            "Image Name,Label", // header row
                            ...finalizedImages.map((image: any) => {
                                return `${image.image_url},${image.label}`;
                            }),
                        ].join('\n');
                        const blob = new Blob([csvData], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'labeled_images.csv';
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({
                            title: 'Labeled dataset downloaded successfully',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                        });
                    }
                    }
                >
                    Download Labeled Images
                </Button>
                <SimpleGrid columns={[2, null, 4]} spacing="40px">
                    {finalizedImages.map((image: any, index: number) => (
                        <ImageCard
                            key={index}
                            image_url={image.image_url}
                            label={image.label}
                            tags={[
                                image.labeled_status ? 'Labeled' : 'Not Labeled',
                                image.accepted_status ? 'Accepted' : 'Not Accepted',
                            ]} />
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