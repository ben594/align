import ProjectCard, { ProjectCardInfo } from './ProjectCard'

import AddCard from './AddCard'
import { SimpleGrid } from '@chakra-ui/react'

type CardInfoList = {
  infoList: ProjectCardInfo[]
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
