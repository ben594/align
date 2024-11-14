import {Menu, MenuButton, MenuList, MenuItemOption, Flex, IconButton, MenuOptionGroup } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

type FilterBarProps = {
    onSortChange: (sortCriteria: string) => void,
    onFilterChange: (filters: string[]) => void,
    sortCriteria: string,
    tagSet: Array<string>
};

export default function FilterBar({ onSortChange, sortCriteria, tagSet, onFilterChange }: FilterBarProps) {
    return (
        <Flex gap={4} paddingLeft={10} paddingRight={10}>
            <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                <MenuList>
                    <MenuOptionGroup value={sortCriteria} title='Sort By' type='radio'>
                        <MenuItemOption value="projectName" onClick={() => onSortChange("projectName")}>Project Name</MenuItemOption>
                        <MenuItemOption value="role" onClick={() => onSortChange("role")}>Role</MenuItemOption>
                        <MenuItemOption value="tags" onClick={() => onSortChange("tags")}>Tags</MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <AutoComplete openOnFocus multiple onChange={onFilterChange}>
                <AutoCompleteInput placeholder="Search...">
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
                    {tagSet.map((tag) => (
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
        </Flex>
    );
}