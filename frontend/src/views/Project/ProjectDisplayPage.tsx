import {
  Box,
  SimpleGrid,
  Image,
} from '@chakra-ui/react'

import Header from '../../components/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../constants'

export default function ProjectDisplayPage() {
  const path = window.location.pathname;
  const parts = path.split('/');
  const projectID = parseInt(parts[2], 10);
  if (isNaN(projectID)) {
    console.error("Invalid projectID:", projectID);
  }

  const ImageGrid = ({ projectID }: { projectID: number }) => {
    const [projectImages, setProjectImages] = useState([]);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/project/${projectID}/images`);
          setProjectImages(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchImages();
    }, [projectID]);

    return (
      <SimpleGrid columns={[2, null, 4]} spacing="40px">
        {projectImages.map((image_url: any, index: number) => (
          <Box key={index}>
            <Image src={image_url} w="100%" h="200%"/>
          </Box>
        ))}
      </SimpleGrid>
    );
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
      <ImageGrid projectID={projectID} />
    </Box>
  );

}