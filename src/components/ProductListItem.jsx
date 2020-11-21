import {
  ListItem,
  Flex,
  Spacer,
  Icon,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';

const EditIcon = () => <Icon as={MdModeEdit} color="gray.300" />;
const DeleteIcon = () => <Icon as={MdDeleteForever} color="gray.300" />;

const ProductListItem = ({ item, onDelete }) => {
  return (
    <ListItem
      bg="gray.400"
      p="0.3rem"
      borderRadius="5px"
      color="white"
      key={item.code}
    >
      <Flex alignItems="center">
        {item.name}
        <Spacer />
        <IconButton
          size="sm"
          icon={<EditIcon />}
          colorScheme="teal"
          variant="solid"
          mr="0.3rem"
          as={Link}
          href={`/edit/${item.code}`}
        />
        <IconButton
          size="sm"
          icon={<DeleteIcon />}
          colorScheme="teal"
          variant="solid"
          onClick={() => onDelete(item)}
        />
      </Flex>
    </ListItem>
  );
};

export default ProductListItem;
