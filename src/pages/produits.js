import useSWR from 'swr';
import axios from 'axios';
import Head from 'next/head';
import {
  Container,
  Box,
  List,
  ListItem,
  IconButton,
  Input,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { GoTrashcan, GoPlus } from 'react-icons/go';
import { useForm } from 'react-hook-form';

const fetcher = (url) => fetch(url).then((d) => d.json());
const apiAdd = async (infos) => {
  await axios.post('/api/produits', { action: 'add', doc: infos });
};
const apiDelete = async (code) => {
  await axios.post('/api/produits', { action: 'delete', code });
};

const Produits = () => {
  const { data, mutate } = useSWR('/api/produits', fetcher);
  const { register, handleSubmit, errors, reset, setValue } = useForm();
  const addProduit = async (infos) => {
    mutate([...data, infos], false);
    await apiAdd(infos);
    mutate();
    reset();
  };
  const deleteProduit = async (code) => {
    const item = data.find((p) => p.code === code);
    setValue('code', item.code);
    setValue('name', item.name);
    mutate(data.filter((p) => p.code !== code), false);
    await apiDelete(code);
    mutate();
  };
  console.log(data);
  return (
    <Container>
      <Head>
        <title>Produits</title>
      </Head>
      <Box my="2rem" fontSize="20px" textAlign="center" w="100%">
        Base de produits
      </Box>
      <form onSubmit={handleSubmit(addProduit)}>
        <Flex my="2rem">
          <Input
            name="code"
            required
            placeholder="code"
            size="sm"
            mr="1rem"
            isInvalid={!!errors.code}
            ref={register()}
          />
          <Input
            name="name"
            required
            placeholder="nom"
            size="sm"
            mr="1rem"
            isInvalid={!!errors.name}
            ref={register()}
          />
          <IconButton
            type="submit"
            size="sm"
            icon={<GoPlus />}
            colorScheme="teal"
            variant="solid"
          />
        </Flex>
      </form>
      <List spacing={3}>
        {data?.map((item) => (
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
                icon={<GoTrashcan />}
                colorScheme="teal"
                variant="solid"
                onClick={() => deleteProduit(item.code)}
              />
            </Flex>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Produits;
