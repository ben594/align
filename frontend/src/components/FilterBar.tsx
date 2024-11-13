import { Menu, MenuButton, Button, MenuList, MenuItemOption, Flex, Input, IconButton, MenuOptionGroup} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';

type FilterBarProps = {
    onSortChange: (sortCriteria: string) => void,
    sortCriteria: string,
};  

export default function FilterBar({ onSortChange, sortCriteria } : FilterBarProps) {
    return (
        <Flex gap={4} paddingLeft={10} paddingRight={10}>
            <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} icon={<HamburgerIcon />}/>
                <MenuList>
                    <MenuOptionGroup value={sortCriteria} title='Sort By' type='radio'>
                        <MenuItemOption value="projectName" onClick={() => onSortChange("projectName")}>Project Name</MenuItemOption>
                        <MenuItemOption value="role" onClick={() => onSortChange("role")}>Role</MenuItemOption>
                        <MenuItemOption value="tags" onClick={() => onSortChange("tags")}>Tags</MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <Input placeholder="Start typing..." />
            <Button>Filter!</Button>
        </Flex>
    );
}