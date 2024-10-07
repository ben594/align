import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ImageScroller from "./ImageScroller";

export default function ReviewingInterface() {
  const { projectId } = useParams();
  const [images, setImages] = useState<string[]>([]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <ImageScroller interface_type="review" images={images} />
    </Box>
  )
}
