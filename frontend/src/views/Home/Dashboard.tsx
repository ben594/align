import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import CardList from '../../components/CardList'
import Header from '../../components/Header'
import { Project } from '../Project/ProjectCreationPage'
import axios from 'axios'

export default function HomePage() {
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
      console.error(`Error fetching my projects:`, error)
    }
  }

  const getAllProjects = async () => {
    const token = sessionStorage.getItem('jwt')
    try {
      const response = await axios.get(`${BACKEND_URL}/projects/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      const projectList: Project[] = parseProjectInfo(response.data.projects)
      setExploreProjectsCards(projectList)
    } catch (error) {
      console.error(`Error fetching all projects:`, error)
    }
  }

  useEffect(() => {
    getProjects()
    getAllProjects()
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
      <Tabs align="center" width="100%" variant="soft-rounded">
        <TabList
          position="sticky"
          top="70px"
          zIndex="2"
          backgroundColor="white"
          justifyContent="flex-start"
          paddingLeft="30px"
        >
          <Tab margin="10px" fontSize="sm">
            My Projects
          </Tab>
          <Tab margin="10px" fontSize="sm">
            Explore
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CardList infoList={myProjectsCards} includeAddCard={true} />
          </TabPanel>
          <TabPanel>
            <CardList infoList={exploreProjectsCards} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
