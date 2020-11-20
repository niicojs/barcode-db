import { useState } from 'react';
import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

const SearchInput = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const search = () => onSearch(input);
  return (
    <InputGroup>
      <Input
        name="search"
        placeholder="code barre ou text"
        value={input}
        onChange={(evt) => setInput(evt.target.value)}
        onKeyUp={(evt) => {
          if (evt.key === 'Enter') search();
        }}
      />
      <InputRightElement
        children={
          <IconButton
            colorScheme="teal"
            aria-label="rechercher"
            onClick={search}
            icon={<Icon as={MdSearch}  />}
          />
        }
      />
    </InputGroup>
  );
};

export default SearchInput;
