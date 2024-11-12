import { Box, Heading, IconButton } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowBackIcon } from '@chakra-ui/icons'
import FlexColumn from '../../components/FlexColumn'
import FlexRow from '../../components/FlexRow'
import Header from '../../components/Header'
import RoleManager from './RoleManager'
import { Spacing } from '../../components/Spacing'

export default function ProjectSettingsPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()

  return (
    <FlexColumn width="100vw" height="100vh" alignItems="center">
      <Header />
      <Box>
        <FlexRow position="relative" justify="center">
          <IconButton
            icon={<ArrowBackIcon />}
            position="absolute"
            left="0"
            aria-label="Back"
            onClick={() => {
              navigate(`/project/${projectId}/images`)
            }}
          />
          <Heading>Project Settings</Heading>
        </FlexRow>
        <Spacing v={32} />
        <RoleManager projectId={projectId} />
      </Box>
    </FlexColumn>
  )
}
