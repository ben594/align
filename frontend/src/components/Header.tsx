/**
 * Header.tsx
 *
 * This file defines a `Header` component that displays a navigation header with options for the user.
 * It includes a menu with options to navigate to the profile, dashboard, leaderboard, and logout.
 */

import { HamburgerIcon } from '@chakra-ui/icons'
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
import { useEffect, useState } from 'react'
import { IoHomeOutline } from 'react-icons/io5'
import { IoTrophyOutline } from 'react-icons/io5'
import { IoLogOutOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Header() {
  const user_id = sessionStorage.getItem('user_id')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const checkLoggedIn = () => {
    const token = sessionStorage.getItem('jwt')
    if (!token) {
      console.error('User not authenticated.')
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  const navigate = useNavigate()

  const goToLanding = () => {
    if (isAuthenticated === true) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }

  const goToProfile = () => {
    if (user_id) {
      navigate(`/profile/${user_id}`)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('jwt')
    navigate('/auth')
  }

  const [avatarSrc, setAvatarSrc] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/profile/${user_id}/profile_image`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setAvatarSrc(data))
      .catch(error => console.error("Error fetching user's name:", error))
  }, [user_id])

  return (
    <Box
      width="100%"
      position="sticky"
      height="70px"
      backgroundColor="white"
      zIndex={10}
      top="0px"
      boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
      marginBottom={8}
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
          {isAuthenticated && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  icon={<Avatar boxSize="25px" src={avatarSrc || undefined} />}
                  onClick={goToProfile}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  icon={<IoHomeOutline size="24px" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  icon={<IoTrophyOutline size="24px" />}
                  onClick={() => navigate('/leaderboard')}
                >
                  Leaderboard
                </MenuItem>
                <MenuItem
                  icon={<IoLogOutOutline size="24px" />}
                  onClick={logout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
