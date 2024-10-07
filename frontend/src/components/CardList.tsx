import { SimpleGrid } from '@chakra-ui/react'

import ProjectCard, { ProjectCardInfo } from './ProjectCard'

type CardInfoList = {
  infoList: ProjectCardInfo[]
}

export default function CardList({ infoList }: CardInfoList) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={7}
      p={10}
      width="100%"
    >
      {infoList.map((cardInfo, index) => (
        <ProjectCard key={index} {...cardInfo} />
      ))}
    </SimpleGrid>
  )
}
