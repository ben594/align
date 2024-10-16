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
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Leaderboard() {

    //const topLabelers = axios.get(`${BACKEND_URL}/signup`, {
    //  firstname: firstname,
    //lastname: lastname,
    // })

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            gap={8}
        >
            <Header />
            <TableContainer
                width="80vw"
                height="80vh"
                shadow="lg"
                borderRadius="md"
                mt={100}>
                <Heading size="lg" mb={4} textAlign="center">Labeling Leaderboard</Heading> {/* Header for the first table */}
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Vendor</Th>
                            <Th># Upvotes</Th>
                            <Th isNumeric>Accepted Rate %</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Labeler 1</Td>
                            <Td>500</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>Labeler 2</Td>
                            <Td>200</Td>
                            <Td isNumeric>30.48</Td>
                        </Tr>
                        <Tr>
                            <Td>Labeler 3</Td>
                            <Td>100</Td>
                            <Td isNumeric>0.91444</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

            <TableContainer
                width="80vw"
                height="80vh"
                shadow="lg"
                borderRadius="md">
                <Heading size="lg" mb={4} textAlign="center">Project Leaderboard</Heading> {/* Header for the first table */}

                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th># Images Labeled</Th>
                            <Th isNumeric>Progress</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Project 1</Td>
                            <Td>100</Td>
                            <Td>
                                <Progress value={25.4} max={100} size="sm" colorScheme="blue" />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Project 2</Td>
                            <Td>300</Td>
                            <Td>
                                <Progress value={25.4} max={100} size="sm" colorScheme="blue" />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Project 3</Td>
                            <Td>400</Td>
                            <Td>
                                <Progress value={25.4} max={100} size="sm" colorScheme="blue" />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}