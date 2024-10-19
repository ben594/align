import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react'

import CardList from '../../components/CardList'
import Header from '../../components/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { Project } from '../Project/ProjectCreationPage'

export default function HomePage() {
  const toast = useToast()
  const navigate = useNavigate()

  const [myProjectsCards, setMyProjectsCards] = useState<Project[]>([])
  const [exploreProjectsCards, setExploreProjectsCards] = useState<Project[]>(
    []
  )

  const parseProjectInfo = (projectListRaw: Project[]): Project[] => {
    const projectList: Project[] = []

    projectListRaw.forEach((projectRaw: Project) => {
      projectList.push(projectRaw as Project)
    })

    return projectList
  }

  const getProjects = async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(`${BACKEND_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      const projectList: Project[] = parseProjectInfo(response.data.projects)
      setMyProjectsCards(projectList)
    } catch (error) {
      console.error(`Error fetching projects:`, error)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      overflowY="auto"
    >
      <Header />
      <Box width="100%" paddingTop="70px">
        <Tabs align="center" width="100%" variant="soft-rounded">
          <TabList
            width="100%"
            position="fixed"
            backgroundColor="white"
            zIndex={1}
            justifyContent="flex-start"
            paddingLeft="30px"
            paddingTop="5px"
            paddingBottom="5px"
          >
            <Tab margin="10px" fontSize="sm">
              My Projects
            </Tab>
            <Tab margin="10px" fontSize="sm">
              Explore
            </Tab>
          </TabList>
          <TabPanels paddingTop="20px">
            <TabPanel>
              <CardList infoList={myProjectsCards} includeAddCard={true} />
            </TabPanel>
            <TabPanel>
              <CardList infoList={exploreProjectsCards} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}
