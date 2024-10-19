import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const goToLanding = () => {
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <Box width="100%" position="sticky" height="70px" backgroundColor="white" zIndex={1} top="0px">
      <Flex padding="15px" justify="space-between">
        <Heading marginLeft="40px" size="lg" cursor="pointer" onClick={goToLanding}>
          align
        </Heading>
        <Flex align="center" paddingRight="10px">
          <IconButton
            aria-label="Profile"
            icon={
              <Avatar
                size="sm"
              />
            }
            variant="outline"
            size="lg"
            onClick={goToProfile}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
