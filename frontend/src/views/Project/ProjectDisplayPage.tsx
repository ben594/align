import {
  Box,
  SimpleGrid,
  Image,
} from '@chakra-ui/react'

import Header from '../../components/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../constants'
import { useParams } from 'react-router-dom'

export default function ProjectDisplayPage() {
  const projectID = Number(useParams().projectID);
  if (isNaN(projectID)) {
    console.error("Invalid projectID:", projectID);
  }

  const ImageGrid = ({ projectID }: { projectID: number }) => {
    const [projectImages, setProjectImages] = useState([]);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          console.log("in frontend")
          const response = await axios.get(`${BACKEND_URL}/project/${projectID}/images`);
          console.log("fetch request completed")
          setProjectImages(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchImages();
    }, [projectID]);

    return (
      <SimpleGrid columns={[2, null, 4]} spacing="40px">
        {projectImages.map((image: any) => (
          <Box key={image.id}>
            <Image src={image.image_url} alt={image.label_text} />
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