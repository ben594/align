import {
  Box,
  Divider,
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

const testCardInfo = [
  { name: 'abc', description: 'This is a sample project.', deadline: null },
  { name: 'abc2', description: 'This is a sample project', deadline: null },
  { name: 'abc2', description: 'This is a sample project', deadline: null },
  { name: 'abc2', description: 'This is a sample project', deadline: null },
  { name: 'abc2', description: 'This is a sample project', deadline: null },
]

export default function HomePage() {
  const toast = useToast()

  const [myProjectsCards, setMyProjectsCards] = useState([])
  const [labelProjectsCards, setLabelProjectsCards] = useState(testCardInfo)
  const [reviewProjectsCards, setReviewProjectsCards] = useState(testCardInfo)
  const [exploreProjectsCards, setExploreProjectsCards] = useState(testCardInfo)

  const getVendorProjects = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/projects/vendor`, {
        withCredentials: true,
      })
      setMyProjectsCards(response.data.projects)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Unable to get vendor projects.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }
  }

  useEffect(() => {
    getVendorProjects()
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
              My Labels
            </Tab>
            <Tab margin="10px" fontSize="sm">
              My Reviews
            </Tab>
            <Tab margin="10px" fontSize="sm">
              Explore
            </Tab>
          </TabList>
          <Divider position="fixed" zIndex={1} />
          <TabPanels paddingTop="20px">
            <TabPanel>
              <CardList infoList={myProjectsCards} includeAddCard={true} />
            </TabPanel>
            <TabPanel>
              <CardList infoList={labelProjectsCards} />
            </TabPanel>
            <TabPanel>
              <CardList infoList={reviewProjectsCards} />
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
