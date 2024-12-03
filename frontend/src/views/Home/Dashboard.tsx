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
  const [exploreProjectsCards, setExploreProjectsCards] = useState<Project[]>(
    []
  )
  const [sortCriteria, setSortCriteria] = useState<string>('projectName')
  const [myTagSet, setMyTagSet] = useState<string[]>([])
  const [exploreTagSet, setExploreTagSet] = useState<string[]>([])
  const [filters, setFilters] = useState<string[]>([])
  const [mode, setMode] = useState<string>('search')
  const [searchText, setSearchText] = useState('')

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
      projectList.forEach(project => {
        setMyTagSet(prevTagSet =>
          Array.from(new Set([...prevTagSet, ...project.tags]))
        )
      })
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
      projectList.forEach(project => {
        setExploreTagSet(prevTagSet =>
          Array.from(new Set([...prevTagSet, ...project.tags]))
        )
      })
    } catch (error) {
      console.error(`Error fetching all projects:`, error)
    }
  }

  const applyFilters = (projects: Project[]): Project[] => {
    if (filters.length === 0) {
      return projects
    }
    return projects.filter(project => {
      return filters.some(tag => project.tags.includes(tag))
    })
  }

  const applySearch = (projects: Project[]): Project[] => {
    return projects.filter(project => {
      const projectName = project.name.toLowerCase()
      const projectDescription = project.description.toLowerCase()
      const projectPrice = project.pricePerImage
      const searchTextLower = searchText.toLowerCase()
      const projectText = projectName + projectDescription + projectPrice
      return projectText.includes(searchTextLower)
    })
  }

  const applySorting = (projects: Project[]): Project[] => {
    if (sortCriteria) {
      return [...projects].sort((a, b) => {
        if (sortCriteria === 'projectName') {
          return a.name.localeCompare(b.name)
        } else if (sortCriteria === 'role') {
          if (a.role === null) return 1
          if (b.role === null) return -1
          return a.role!.localeCompare(b.role!)
        } else if (sortCriteria === 'tags') {
          if (a.tags === null || a.tags.length === 0) return 1
          if (b.tags === null || b.tags.length === 0) return -1
          return a.tags[0].localeCompare(b.tags[0])
        }
        return 0
      })
    }
    return projects
  }

  const applyFiltersAndSorting = (projects: Project[]): Project[] => {
    return applySearch(applyFilters(applySorting(projects)))
  }

  // These four functions probably shouldn't be in this scope but its fine
  const onFilterChange = (inputFilters: string[]) => {
    setFilters(inputFilters)
  }

  const onTagRemoved = () => {
    if (filters.length === 1) {
      setFilters([]) // fixes a weird bug
    }
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const onToggleMode = () => {
    if (mode == 'search') {
      setMode('tags')
    } else {
      setMode('search')
    }
  }

  const resetSearch = () => {
    setFilters([])
    setSortCriteria('projectName')
    setMode('search')
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
      <Tabs
        align="center"
        width="100%"
        variant="soft-rounded"
        onChange={resetSearch}
      >
        <TabList
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
            <FilterBar
              onSortChange={setSortCriteria}
              sortCriteria={sortCriteria}
              tagSet={myTagSet}
              onFilterChange={onFilterChange}
              onTagRemoved={onTagRemoved}
              mode={mode}
              onToggleMode={onToggleMode}
              searchText={searchText}
              onSearchChange={onSearchChange}
            />
            <CardList
              infoList={applyFiltersAndSorting(myProjectsCards)}
              includeAddCard={true}
            />
          </TabPanel>
          <TabPanel>
            <FilterBar
              onSortChange={setSortCriteria}
              sortCriteria={sortCriteria}
              tagSet={exploreTagSet}
              onFilterChange={onFilterChange}
              onTagRemoved={onTagRemoved}
              mode={mode}
              onToggleMode={onToggleMode}
              searchText={searchText}
              onSearchChange={onSearchChange}
            />
            <CardList infoList={applyFiltersAndSorting(exploreProjectsCards)} />{' '}
            {/*Fix swapping behavior*/}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
