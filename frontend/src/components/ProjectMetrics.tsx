/**
 * ProjectMetrics.tsx
 *
 * This file defines a `ProjectMetrics` component that displays project metrics such as
 * the percentage of labeled and approved items.
 * */

import {
  Card,
  StatLabel,
  CardBody,
  Stat,
  StatNumber,
  Flex,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../constants'

interface ProjectMetricsProps {
  projectId: string | undefined
}

const ProjectMetrics = ({ projectId }: ProjectMetricsProps) => {
  const [percentLabeled, setPercentLabeled] = useState(0)
  const [percentApproved, setPercentApproved] = useState(0)

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')

    fetch(`${BACKEND_URL}/project/${projectId}/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setPercentLabeled(data.metrics[0].percent_labeled.percent_labeled)
        setPercentApproved(data.metrics[0].percent_approved.percent_approved)
      })
      .catch(error => console.error("Error fetching user's labels:", error))
  }, [projectId])

  // const fetchMetrics = useCallback(async () => {
  //     const token = sessionStorage.getItem('jwt')
  //     try {
  //         const response = await axios.get(
  //             `${BACKEND_URL}/project/${projectId}/metrics`,
  //             {
  //                 headers: {
  //                     Authorization: `Bearer ${token}`,
  //                 },
  //             }
  //         )

  //         // TODO get num labelers
  //         setPercentLabeled(response.data)
  //     } catch (error) {
  //         console.error(error)
  //     }
  // }, [projectId])

  return (
    <Card>
      <CardBody>
        <Flex direction="column" gap={4}>
          <Stat>
            <StatLabel>% Images Labeled</StatLabel>
            <StatNumber>{percentLabeled}%</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>% Images Approved</StatLabel>
            <StatNumber>{percentApproved}%</StatNumber>
          </Stat>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default ProjectMetrics
