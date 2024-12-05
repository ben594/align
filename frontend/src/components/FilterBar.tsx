/**
 * FilterBar.tsx
 *
 * This file defines a `FilterBar` component that provides sorting, filtering, and search functionality
 * for a list of items. It includes a search input, a sort menu, and a tag filter menu.
 */

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  Flex,
  IconButton,
  MenuOptionGroup,
  Input,
} from '@chakra-ui/react'
import { FaTags } from 'react-icons/fa'
import { FaSearch } from 'react-icons/fa'
import { MdOutlineSortByAlpha } from 'react-icons/md'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete'

type FilterBarProps = {
  onSortChange: (sortCriteria: string) => void
  onFilterChange: (filters: string[]) => void
  onTagRemoved: () => void
  sortCriteria: string
  tagSet: Array<string>
  mode: string
  onToggleMode: () => void
  searchText: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FilterBar({
  onSortChange,
  sortCriteria,
  tagSet,
  onFilterChange,
  onTagRemoved,
  mode,
  onToggleMode,
  searchText,
  onSearchChange,
}: FilterBarProps) {
  return (
    <Flex gap={4} paddingLeft={10} paddingRight={10}>
      <Menu closeOnSelect={false}>
        <MenuButton as={IconButton} icon={<MdOutlineSortByAlpha />} />
        <MenuList>
          <MenuOptionGroup value={sortCriteria} title="Sort By" type="radio">
            <MenuItemOption
              value="projectName"
              onClick={() => onSortChange('projectName')}
            >
              Project Name
            </MenuItemOption>
            <MenuItemOption value="role" onClick={() => onSortChange('role')}>
              Role
            </MenuItemOption>
            <MenuItemOption value="tags" onClick={() => onSortChange('tags')}>
              Tags
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      {mode === 'tags' ? (
        <>
          <AutoComplete
            openOnFocus
            multiple
            onChange={onFilterChange}
            onTagRemoved={onTagRemoved}
          >
            <AutoCompleteInput placeholder="Filter by tags...">
              {({ tags }) =>
                tags.map((tag, tid) => (
                  <AutoCompleteTag
                    key={tid}
                    label={tag.label}
                    onRemove={tag.onRemove}
                  />
                ))
              }
            </AutoCompleteInput>
            <AutoCompleteList>
              {tagSet.map(tag => (
                <AutoCompleteItem
                  key={`option-${tag}`}
                  value={tag}
                  textTransform="capitalize"
                >
                  {tag}
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </AutoComplete>
          <IconButton
            onClick={onToggleMode}
            icon={<FaTags />}
            aria-label="Tags"
          />
        </>
      ) : (
        <>
          <Input
            h="38px"
            value={searchText}
            onChange={onSearchChange}
            placeholder="Start typing..."
          />
          <IconButton
            onClick={onToggleMode}
            icon={<FaSearch />}
            aria-label="Search"
          />
        </>
      )}
    </Flex>
  )
}
