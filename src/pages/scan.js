import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import { Container, Box, Flex, List, ListItem } from '@chakra-ui/react';
import axios from 'axios';

import Scanner from '../components/Scanner';

const Scan = () => {
  const scannerRef = useRef(null);
  const history = useRef([]);
  const [ready, setReady] = useState(false);
  const [found, setFound] = useState([]);

  const onDetected = async (data) => {
    if (data) {
      if (!history.current.includes(data)) {
        history.current.push(data);
        console.log(data);
        const response = await axios.get(`/api/produit/${data}`);
        console.log(response.data);
        if (response.data?.name) {
          setFound([response.data, ...found]);
        } else {
          setFound([{ code: data, name: data, unknown: true }, ...found]);
        }
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setReady(true), 50);
  }, []);

  return (
    <Container centerContent="true">
      <Head>
        <title>Auto Courses</title>
      </Head>
      <main>
        <Box m="2rem" fontSize="20px">
          Scanner le produit
        </Box>
      </main>
      <Box ref={scannerRef} position="relative" height="250px">
        <canvas
          style={{ position: 'absolute', top: '0px' }}
          className="drawingBuffer"
          width="320"
          height="240"
        />
        {ready ? (
          <Scanner
            scannerRef={scannerRef}
            minMatch={5}
            onDetected={onDetected}
          />
        ) : null}
      </Box>
      <List mt="2rem" w="100%" spacing={3}>
        {found?.map((item) => (
          <ListItem
            bg="gray.400"
            p="0.3rem"
            borderRadius="5px"
            color="white"
            key={item.code}
          >
            {item.name}
            {/* <Flex alignItems="center">
              {item.name}
              <Spacer />
              <IconButton
                size="sm"
                icon={<GoTrashcan />}
                colorScheme="teal"
                variant="solid"
                onClick={() => deleteProduit(item.code)}
              />
            </Flex> */}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Scan;
