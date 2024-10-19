import ProjectCard from './ProjectCard'

import AddCard from './AddCard'
import { SimpleGrid } from '@chakra-ui/react'
import { Project } from '../views/Project/ProjectCreationPage'

type CardInfoList = {
  infoList: Project[]
  includeAddCard?: boolean
}

export default function CardList({ includeAddCard, infoList }: CardInfoList) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={7}
      p={10}
      width="100%"
    >
      {includeAddCard && <AddCard />}
      {infoList.map((cardInfo, index) => (
        <ProjectCard key={index} {...cardInfo} />
      ))}
    </SimpleGrid>
  )
}
