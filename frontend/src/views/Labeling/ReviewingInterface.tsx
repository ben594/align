import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ImageScroller from "./ImageScroller";
import Header from "../../components/Header";

export default function ReviewingInterface() {
  const { projectId } = useParams();
  const [images, setImages] = useState<string[]>([]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Header />
      <ImageScroller interface_type="review" images={images} />
    </Box>
  )
}
