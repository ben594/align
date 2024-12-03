import {
  Box,
  Heading,
  IconButton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowBackIcon } from '@chakra-ui/icons'
import FlexColumn from '../../components/FlexColumn'
import FlexRow from '../../components/FlexRow'
import Header from '../../components/Header'
import ProjectEditor from './ProjectEditor'
import RoleManager from './RoleEditor'
import { Spacing } from '../../components/Spacing'

export default function ProjectSettingsPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()

  return (
    <FlexColumn width="100vw" alignItems="center">
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
        {projectId == null ? (
          <Spinner />
        ) : (
          <Tabs isFitted variant="solid-rounded" minWidth="700px">
            <TabList>
              <Tab>General</Tab>
              <Tab>Team</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ProjectEditor projectId={projectId} />
              </TabPanel>
              <TabPanel>
                <RoleManager projectId={projectId} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </FlexColumn>
  )
}
