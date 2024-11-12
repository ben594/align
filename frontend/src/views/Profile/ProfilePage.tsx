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
import CardList from '../../components/CardList'
import { Project } from '../Project/ProjectCreationPage'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function ProfilePage() {
  const { user_id } = useParams()
  const [acceptedLabelCount, setAcceptedLabelCount] = useState<0>()
  const [balance, setBalance] = useState<0>()
  const [email, setEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [tempAvatarSrc, setTempAvatarSrc] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [userProjectsCards, setUserProjectsCards] = useState<Project[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const parseProjectInfo = (projectListRaw: Project[]): Project[] => {
    const projectList: Project[] = []

    projectListRaw.forEach((projectRaw: Project) => {
      projectList.push(projectRaw as Project)
    })

    return projectList
  }

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/profile/${user_id}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setAcceptedLabelCount(data.num_accepted_labels)
        setBalance(data.balance)
      })
      .catch(error =>
        console.error("Error fetching user's accepted label count:", error)
      )
  }, [user_id])

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/profile/${user_id}/user_name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setUserName(data))
      .catch(error => console.error("Error fetching user's name:", error))
  }, [user_id])

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/profile/${user_id}/email`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setEmail(data))
      .catch(error => console.error("Error fetching user's email:", error))
  }, [user_id])

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

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/user/${user_id}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserProjectsCards(data.projects)
      })
      .catch(error => console.error("Error fetching user's projects:", error))
  }, [user_id])

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
          <VStack>
            <Stat>
              <StatLabel>Account Balance ($USD)</StatLabel>
              <StatNumber>{balance}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Accepted Label Count</StatLabel>
              <StatNumber>{acceptedLabelCount}</StatNumber>
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
            <Text color="gray.500">{email}</Text>

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
        <Box width="80%">
          <Heading marginTop="80px" textAlign="center">
            Vendor Projects
          </Heading>
          <CardList infoList={userProjectsCards} includeAddCard={false} />
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
