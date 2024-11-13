import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { BACKEND_URL } from '../../constants'
import CardList from '../../components/CardList'
import Header from '../../components/Header'
import { Project } from '../Project/ProjectCreationPage'
import axios from 'axios'
import FilterBar from '../../components/FilterBar'

export default function HomePage() {
  const [myProjectsCards, setMyProjectsCards] = useState<Project[]>([])
  const [exploreProjectsCards, setExploreProjectsCards] = useState<Project[]>([])
  const [sortCriteria, setSortCriteria] = useState<string>("projectName")

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
      console.log(projectList)
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

  const applySorting = (projects: Project[]): Project[] => {
    if (sortCriteria) {
      return [...projects].sort((a, b) => {
        if (sortCriteria === "projectName") {
          return a.name.localeCompare(b.name);
        } else if (sortCriteria === "role") {
          if (a.role === null) return 1;
          if (b.role === null) return -1;
          return a.role!.localeCompare(b.role!);
        } else if (sortCriteria === "tags"){
          if(a.tags === null || a.tags.length === 0) return 1;
          if(b.tags === null || b.tags.length === 0) return -1;
          return a.tags[0].localeCompare(b.tags[0]);
        }
        return 0;
      });
    }
    return projects;
  };

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
      <Tabs align="center" width="100%" variant="soft-rounded" onChange={() => setSortCriteria("projectName")}>
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
            <FilterBar onSortChange={setSortCriteria} sortCriteria={sortCriteria}/>
            <CardList infoList={applySorting(myProjectsCards)} includeAddCard={true} />
          </TabPanel>
          <TabPanel>
            <FilterBar onSortChange={setSortCriteria} sortCriteria={sortCriteria}/>
            <CardList infoList={applySorting(exploreProjectsCards)} /> {/*Fix swapping behavior*/}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
