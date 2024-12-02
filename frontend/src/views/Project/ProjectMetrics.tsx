// 
/**
 * displaying the percentage of images labeled
 * number of unique labellers
 * and other helpful metrics. 
 * When a Project has been completed, 
 * the Project Administrators can download the labeled dataset.

 */
import {
    Box,
    Button,
    Text,
    Card,
    StatLabel,
    CardBody,
    IconButton,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
    Stat,
    StatNumber,
    Flex,
} from '@chakra-ui/react'
import FlexRow from '../../components/FlexRow'
import { LineChart } from '@saas-ui/charts'


interface ProjectMetricsProps {
    projectId: string
}

const ProjectMetrics = ({ projectId }: ProjectMetricsProps) => {
    const valueFormatter = (value: number | bigint) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value)
    }

    const data = [
        {
            date: 'Jan 1',
            Revenue: 1475,
        },
        {
            date: 'Jan 8',
            Revenue: 1936,
        },
        {
            date: 'Jan 15',
            Revenue: 1555,
        },
        {
            date: 'Jan 22',
            Revenue: 1557,
        },
        {
            date: 'Jan 29',
            Revenue: 1977,
        },
        {
            date: 'Feb 5',
            Revenue: 2315,
        },
        {
            date: 'Feb 12',
            Revenue: 1736,
        },
        {
            date: 'Feb 19',
            Revenue: 1981,
        },
        {
            date: 'Feb 26',
            Revenue: 2581,
        },
        {
            date: 'Mar 5',
            Revenue: 2592,
        },
        {
            date: 'Mar 12',
            Revenue: 2635,
        },
        {
            date: 'Mar 19',
            Revenue: 2074,
        },
        {
            date: 'Mar 26',
            Revenue: 2984,
        },
        {
            date: 'Apr 2',
            Revenue: 2254,
        },
        {
            date: 'Apr 9',
            Revenue: 3159,
        },
        {
            date: 'Apr 16',
            Revenue: 2804,
        },
        {
            date: 'Apr 23',
            Revenue: 2602,
        },
        {
            date: 'Apr 30',
            Revenue: 2840,
        },
        {
            date: 'May 7',
            Revenue: 3299,
        },
        {
            date: 'May 14',
            Revenue: 3487,
        },
        {
            date: 'May 21',
            Revenue: 3439,
        },
        {
            date: 'May 28',
            Revenue: 3095,
        },
        {
            date: 'Jun 4',
            Revenue: 3252,
        },
        {
            date: 'Jun 11',
            Revenue: 4096,
        },
        {
            date: 'Jun 18',
            Revenue: 4193,
        },
        {
            date: 'Jun 25',
            Revenue: 4759,
        },
    ]

    return (
        <Card>
            <CardBody>
                <Box>
                    <Flex gap={4}>
                        <Stat>
                            <StatLabel>Number of Images Labeled</StatLabel>
                            <StatNumber>0</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Unique Labellers</StatLabel>
                            <StatNumber>0</StatNumber>
                        </Stat>
                    </Flex>
                </Box>
                <Box>
                    <LineChart
                        data={data}
                        categories={['Revenue']}
                        valueFormatter={valueFormatter}
                        yAxisWidth={80}
                        height="300px"
                    />
                </Box>
            </CardBody>
        </Card>
    )
}
export default ProjectMetrics