import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading,
    Progress,
} from '@chakra-ui/react'
import Header from "../../components/Header";
import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../constants'

export default function Leaderboard() {
    const [topLabelers, setTopLabelers] = useState<{ name: string; labeled_count: number; accepted_rate: number }[]>([]);
    const [topProjects, setTopProjects] = useState<{ name: string; unique_contributers: number; progress: number }[]>([]);

    // Fetch top 3 labelers
    useEffect(() => {
        fetch(`${BACKEND_URL}/labeler_leaderboard`)
            .then(response => response.json())
            .then(data => setTopLabelers(data))  // Store the result in the state
            .catch(error => console.error('Error fetching top leaderboard:', error));
    }, []);

    // Fetch top 3 projects
    useEffect(() => {
        fetch(`${BACKEND_URL}/project_leaderboard`)
            .then(response => response.json())
            .then(data => setTopProjects(data))  // Store the result in the state
            .catch(error => console.error('Error fetching top projects:', error));
    }, []);


    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            gap={10}
        >
            <Header />
            <TableContainer
                width="80vw"
                height="80vh"
                shadow="lg"
                borderRadius="md"
            >
                <Heading size="lg" mb={4} textAlign="center">Labeling Leaderboard</Heading> {/* Header for the first table */}
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Labeler</Th>
                            <Th># Images Labeled</Th>
                            <Th isNumeric>Accepted Rate %</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {topLabelers.map((labeler, index) => (
                            <Tr key={index}>
                                <Td>{labeler.name}</Td>
                                <Td>{labeler.labeled_count}</Td>
                                <Td>{labeler.accepted_rate}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <TableContainer
                width="80vw"
                height="80vh"
                shadow="lg"
                borderRadius="md">
                <Heading size="lg" mb={4} textAlign="center">Most Popular Projects</Heading> {/* Header for the first table */}

                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Project Name</Th>
                            <Th># Labelers</Th>
                            <Th isNumeric>Progress</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {topProjects.map((project, index) => (
                            <Tr key={index}>
                                <Td>{project.name}</Td>
                                <Td>{project.unique_contributers}</Td>
                                <Td>
                                    <Progress value={project.progress} max={100} size="sm" colorScheme="blue" />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}