
import {
    Card,
    StatLabel,
    CardBody,
    Stat,
    StatNumber,
    Flex,
} from '@chakra-ui/react'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { BACKEND_URL } from '../constants'


interface ProjectMetricsProps {
    projectId: string | undefined
}

const ProjectMetrics = ({ projectId }: ProjectMetricsProps) => {
    const [percentLabeled, setPercentLabeled] = useState(0)
    const [uniqueLabellers, setUniqueLabellers] = useState(0)

    const fetchMetrics = useCallback(async () => {
        const token = sessionStorage.getItem('jwt')
        try {
            const response = await axios.get(
                `${BACKEND_URL}/project/${projectId}/metrics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            // TODO get num labelers
            setPercentLabeled(response.data)
        } catch (error) {
            console.error(error)
        }
    }, [projectId])

    return (
        <Card>
            <CardBody>
                <Flex direction="column" gap={4}>
                    <Stat>
                        <StatLabel>% Images Labeled</StatLabel>
                        <StatNumber>{percentLabeled}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Unique Labellers</StatLabel>
                        <StatNumber>{uniqueLabellers}</StatNumber>
                    </Stat>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default ProjectMetrics