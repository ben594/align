import { Menu, MenuButton, Button, MenuList, MenuItemOption, Flex, Input, IconButton, MenuOptionGroup} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';

type FilterBarProps = {
    onSortChange: (sortCriteria: string) => void;
};  

export default function FilterBar({ onSortChange } : FilterBarProps) {
    return (
        <Flex gap={4} paddingLeft={10} paddingRight={10}>
            <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} icon={<HamburgerIcon />}/>
                <MenuList>
                    <MenuOptionGroup defaultValue="projectName" title='Sort By' type='radio'>
                        <MenuItemOption value="projectName" onClick={() => onSortChange("projectName")}>Project Name</MenuItemOption>
                        <MenuItemOption value="role" onClick={() => onSortChange("role")}>Role</MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <Input placeholder="Start typing..." />
            <Button>Filter!</Button>
        </Flex>
    );
}