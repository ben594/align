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
import LabelList from '../../components/LabelList'

import { Project } from '../Project/ProjectCreationPage'
import PaymentList from '../../components/PaymentList'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export interface Label {
  project_name: ReactNode
  project_id: number
  accepted_status: boolean
  label_text: string
}

export interface Payment {
  id: number
  userID: number
  senderID: number | undefined
  transactionTime: string
  balanceChange: number
}

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
  const [userLabels, setUserLabels] = useState<Label[]>([])
  const [userPayments, setUserPayments] = useState<Payment[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isBadgeOpen,
    onOpen: onBadgeOpen,
    onClose: onBadgeClose,
  } = useDisclosure()

  const [clickedBadge] = useState('')
  const handleBadgeClick = () => {
    onBadgeOpen()
  }

  const toast = useToast()
  const myUserId = sessionStorage.getItem('user_id')

  const parseProjectInfo = (projectListRaw: Project[]): Project[] => {
    const projectList: Project[] = []

    projectListRaw.forEach((projectRaw: Project) => {
      projectList.push(projectRaw as Project)
    })

    return projectList
  }

  // on load, get user's stats from backend
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

  // on load, get user's name from backend
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

  // on load, get user's email from backend
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

  // on load, get user's profile picture from backend
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

  // on load, get user's project list from backend
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

  // on load, get user's payment history from backend
  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    fetch(`${BACKEND_URL}/user/${user_id}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserPayments(data.payments)
      })
      .catch(error => console.error("Error fetching user's payments:", error))
  }, [user_id])

  // on load, get user's label history from backend
  useEffect(() => {
    const token = sessionStorage.getItem('jwt')

    fetch(`${BACKEND_URL}/user/${user_id}/labels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserLabels(data.labels)
      })
      .catch(error => console.error("Error fetching user's labels:", error))
  }, [user_id])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // handle profile picture change
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
    if (myUserId === user_id) {
      setTempAvatarSrc(avatarSrc)
      onOpen()
    }
  }

  return (
    <>
      <Box
        flexDirection="column"
        width="100vw"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Header />
        <Box
          width="100vw"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack align="start" spacing={2} mt={4} mr={7}>
            <Stat>
              <StatLabel>Account Balance ($USD)</StatLabel>
              <StatNumber>{balance}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Accepted Label Count</StatLabel>
              <StatNumber>{acceptedLabelCount}</StatNumber>
            </Stat>

            {/* placeholder, need to update */}
            
            <Stat>
              <StatLabel>Bonus (Align Points)</StatLabel>
              {(acceptedLabelCount ?? 0) >= 1 && (acceptedLabelCount ?? 0) <= 9 &&(
                <StatNumber>{1}</StatNumber>
              )}
              {(acceptedLabelCount ?? 0) >= 10 && (acceptedLabelCount ?? 0) <= 49 &&(
                <StatNumber>{11}</StatNumber>
              )}
              {(acceptedLabelCount ?? 0) >= 50 && (acceptedLabelCount ?? 0) <= 99 &&(
                <StatNumber>{61}</StatNumber>
              )}
              {(acceptedLabelCount ?? 0) >= 100 && (acceptedLabelCount ?? 0) <= 999 &&(
                <StatNumber>{161}</StatNumber>
              )}
              {(acceptedLabelCount ?? 0) >= 1000 &&(
                <StatNumber>{1161}</StatNumber>
              )}
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
                {myUserId === user_id && (
                  <AvatarBadge
                    boxSize="1em"
                    bg={isHovered ? 'blue.600' : 'blue.500'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={EditIcon} boxSize="0.3em" color="white" />
                  </AvatarBadge>
                )}
              </Avatar>
            </Box>
            <Heading size="md">{userName}</Heading>
            <Text color="gray.500">{email}</Text>

            <HStack spacing={2} wrap="wrap" justify="center">
              <Badge
                colorScheme="blue"
                variant="outline"
                onClick={() => handleBadgeClick()}
                cursor="pointer"
              >
                Badges
              </Badge>
              {(acceptedLabelCount ?? 0) >= 1 && (
                <Badge colorScheme="pink" variant="solid">
                  +1
                </Badge>
              )}
              {(acceptedLabelCount ?? 0) >= 10 && (
                <Badge colorScheme="purple" variant="solid">
                  +10
                </Badge>
              )}
              {(acceptedLabelCount ?? 0) >= 50 && (
                <Badge colorScheme="green" variant="solid">
                  +50
                </Badge>
              )}
              {(acceptedLabelCount ?? 0) >= 100 && (
                <Badge colorScheme="orange" variant="solid">
                  +100
                </Badge>
              )}
              {(acceptedLabelCount ?? 0) > 999 && (
                <Badge colorScheme="yellow" variant="solid">
                  +1000
                </Badge>
              )}
            </HStack>
            <Modal isOpen={isBadgeOpen} onClose={onBadgeClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>About Badges</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="left" mb="8">
                  <HStack spacing={2} wrap="wrap" justify="center">
                      <Badge
                        colorScheme="blue"
                        variant="outline"
                      >
                        Badges
                      </Badge>
                      <Badge colorScheme="pink" variant="solid">
                        +1
                      </Badge>

                      <Badge colorScheme="purple" variant="solid">
                        +10
                      </Badge>

                      <Badge colorScheme="green" variant="solid">
                        +50
                      </Badge>

                      <Badge colorScheme="orange" variant="solid">
                        +100
                      </Badge>

                      <Badge colorScheme="yellow" variant="solid">
                        +1000
                      </Badge>
                    </HStack>

                    <Text>
                      Badges are awarded when you reach 1, 10, 50, 100, and
                      1000+ label acceptances. <br></br>
                      <br></br>
                      For each badge you earn, you get the respective
                      amount in Bonus (Align Points) which can be spent in the Align 
                      store for special Align merch (coming 2025). <br></br>
                      <br></br>
                      Good luck labeling!
                    </Text>
                    
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </VStack>
        </Box>
        <Box width="80%">
          <Heading marginTop="80px" textAlign="center">
            Projects
          </Heading>
          <CardList infoList={userProjectsCards} includeAddCard={false} />
        </Box>
        <Box width="80%">
          <Heading marginTop="40px" textAlign="center">
            Label History
          </Heading>
          <LabelList labels={userLabels} />
        </Box>
        {userPayments.length > 0 &&
          <Box width="80%">
            <Heading marginTop="40px" textAlign="center">
              Payment History
            </Heading>
            <PaymentList payments={userPayments} />
          </Box>
        }
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
