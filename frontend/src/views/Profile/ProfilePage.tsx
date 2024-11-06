import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { EditIcon } from '@chakra-ui/icons'
import Header from '../../components/Header'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function ProfilePage() {
  const { user_id } = useParams()
  const [acceptedLabelCount, setAcceptedLabelCount] = useState<0>()
  const [userName, setUserName] = useState<string>('')
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [tempAvatarSrc, setTempAvatarSrc] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    fetch(`${BACKEND_URL}/profile/${user_id}/stats`)
      .then(response => response.json())
      .then(data => setAcceptedLabelCount(data))
      .catch(error =>
        console.error("Error fetching user's accepted label count:", error)
      )
  }, [user_id])

  useEffect(() => {
    fetch(`${BACKEND_URL}/profile/${user_id}/user_name`)
      .then(response => response.json())
      .then(data => setUserName(data))
      .catch(error => console.error("Error fetching user's name:", error))
  }, [user_id])

  useEffect(() => {
    fetch(`${BACKEND_URL}/profile/${user_id}/profile_image`)
      .then(response => response.json())
      .then(data => setAvatarSrc(data))
      .catch(error => console.error("Error fetching user's name:", error))
  }, [user_id])

  // TODO: get account balance

  /* I apologize for all of this messy profile picture code. I will clean it up at some point */

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      if (file) {
        const imageUrl = URL.createObjectURL(file)
        setTempAvatarSrc(imageUrl)
      }
    }
  }

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Clear the file input so the same file can be selected again
    }

    setTempAvatarSrc(null)
  }

  const handleCloseModal = async () => {
    if (tempAvatarSrc === null && avatarSrc !== null) {
      try {
        await toast.promise(
          axios
            .post(`${BACKEND_URL}/profile/${user_id}/clear_profile_image`, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
              },
            })
            .then(() => {
              setAvatarSrc(null)
            }),
          {
            loading: {
              title: 'Uploading image',
              description: 'Please wait...',
            },
            success: {
              title: 'Upload successful',
              description: 'Profile image changed successfully!',
            },
            error: {
              title: 'Upload failed',
              description: 'Failed to upload image.',
            },
          }
        )
      } catch (error) {
        console.error(error)
      }
    } else if (tempAvatarSrc !== avatarSrc) {
      try {
        const formData = new FormData()
        const avatarResponse = await fetch(tempAvatarSrc as RequestInfo)
        const blob = await avatarResponse.blob()
        const file = new File([blob], 'profile_image.jpg', { type: blob.type })
        formData.append('profile_image', file)

        await toast.promise(
          axios
            .post(
              `${BACKEND_URL}/profile/${user_id}/upload_profile_image`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
                },
              }
            )
            .then(uploadResponse => {
              setAvatarSrc(uploadResponse.data.avatarUrl)
            }),
          {
            loading: {
              title: 'Uploading image',
              description: 'Please wait...',
            },
            success: {
              title: 'Upload successful',
              description: 'Profile image changed successfully!',
            },
            error: {
              title: 'Upload failed',
              description: 'Failed to upload image.',
            },
          }
        )
      } catch (error) {
        console.error(error)
      }
    }
    onClose()
  }

  const handleOpenModal = () => {
    setTempAvatarSrc(avatarSrc)
    onOpen()
  }

  return (
    <>
      <Box
        flexDirection="column"
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Header />
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack align="flex-start">
            <Stat>
              <StatLabel>Account Balance</StatLabel>
              <StatNumber>$768.39</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Accepted Label Count</StatLabel>
              <StatNumber>{acceptedLabelCount}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                34.22%
              </StatHelpText>
            </Stat>
            <Link to="/leaderboard">
              <Button colorScheme="blue">Compare</Button>
            </Link>
          </VStack>

          <VStack spacing={4} align="center">
            <Box
              position="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              cursor="pointer"
              onClick={handleOpenModal}
            >
              <Avatar
                key={avatarSrc ? 'image' : 'no-image'}
                name={userName}
                size="2xl"
                src={avatarSrc || undefined}
              >
                <AvatarBadge
                  boxSize="1em"
                  bg={isHovered ? 'blue.600' : 'blue.500'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={EditIcon} boxSize="0.3em" color="white" />
                </AvatarBadge>
              </Avatar>
            </Box>
            <Heading size="md">{userName}</Heading>
            <Text color="gray.500">johnsmith@duke.edu</Text>

            <HStack spacing={2} wrap="wrap" justify="center">
              <Badge colorScheme="pink" variant="solid">
                Tag
              </Badge>
              <Badge colorScheme="purple" variant="solid">
                Tag
              </Badge>
              <Badge colorScheme="green" variant="solid">
                Tag
              </Badge>
              <Badge colorScheme="blue" variant="outline">
                Tag
              </Badge>
              <Badge colorScheme="green" variant="solid">
                Tag
              </Badge>
            </HStack>
          </VStack>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="center">
              <Text>
                A picture helps people recognize you and lets you know when
                you're signed in to your account
              </Text>
              <Avatar
                key={tempAvatarSrc ? 'image' : 'no-image'}
                name={userName}
                size="2xl"
                src={tempAvatarSrc || undefined}
                cursor="pointer"
                onClick={handleSelectImageClick}
              />
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <HStack spacing={4} w="90%">
              <Button
                colorScheme="blue"
                w="50%"
                onClick={handleSelectImageClick}
              >
                Change
              </Button>
              <Button variant="ghost" w="50%" onClick={handleRemoveAvatar}>
                Remove
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*" // Only allow image files
          onChange={handleFileChange}
        />
      </Modal>
    </>
  )
}
