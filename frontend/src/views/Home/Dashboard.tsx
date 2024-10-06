import {
  Box,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CardList from "../../components/CardList";
import { useState } from "react";
import Header from "../../components/Header";

const testCardInfo = [
  { name: "abc", description: "This is a sample project.", deadline: null },
  { name: "abc2", description: "This is a sample project", deadline: null },
  { name: "abc2", description: "This is a sample project", deadline: null },
  { name: "abc2", description: "This is a sample project", deadline: null },
  { name: "abc2", description: "This is a sample project", deadline: null },
];

export default function HomePage() {
  const [myProjectsCards, setMyProjectsCards] = useState(testCardInfo);
  const [labelProjectsCards, setLabelProjectsCards] = useState(testCardInfo);
  const [reviewProjectsCards, setReviewProjectsCards] = useState(testCardInfo);
  const [exploreProjectsCards, setExploreProjectsCards] =
    useState(testCardInfo);

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
              <CardList infoList={myProjectsCards} />
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
  );
}
