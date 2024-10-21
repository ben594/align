import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const user_id = sessionStorage.getItem('user_id')

  const navigate = useNavigate()

  const goToLanding = () => {
    navigate('/')
  }

  const goToProfile = () => {
    navigate(`/profile/${user_id}`)
  }

  const logout = () => {
    sessionStorage.removeItem('jwt')
    navigate('/auth')
  }

  return (
    <Box
      width="100%"
      position="sticky"
      height="70px"
      backgroundColor="white"
      zIndex={10}
      top="0px"
    >
      <Flex padding="15px" justify="space-between">
        <Heading
          marginLeft="40px"
          size="lg"
          cursor="pointer"
          onClick={goToLanding}
        >
          align
        </Heading>
        <Flex align="center" paddingRight="10px">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem icon={<Avatar boxSize="25px" />} onClick={goToProfile}>
                Profile
              </MenuItem>
              <MenuItem
                icon={<ArrowForwardIcon boxSize="24px" />}
                onClick={logout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  )
}
