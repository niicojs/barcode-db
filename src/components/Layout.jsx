import Head from 'next/head';
import { useSession } from 'next-auth/client';
import {
  Container,
  Box,
  Divider,
  Flex,
  Image,
  Heading,
  Link,
} from '@chakra-ui/react';

export default function Layout({ title, children }) {
  return (
    <Box w="100%">
      <Head>
        <title>Barcode DB</title>
      </Head>
      <Box w="100%" bg="teal.400" h="0.5rem"></Box>
      <Flex w="100%" alignItems="center">
        <Image boxSize="50px" src="/shopping-cart.png" mx="2rem" my="0.5rem" />
        <Heading
          size="lg"
          as={Link}
          href="/"
          _hover={{ textDecoration: 'none' }}
        >
          Barcode DB
        </Heading>
      </Flex>
      <Container centerContent="true">
        <Divider />
        <Box m="2rem" fontSize="20px">
          {title}
        </Box>
        {children}
      </Container>
    </Box>
  );
}
