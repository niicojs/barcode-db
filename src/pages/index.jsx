import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { List, Box, Link, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import validbarcode from 'barcode-validator';

import Login from '../components/Login';
import SearchInput from '../components/SearchInput';
import ProductListItem from '../components/ProductListItem';
import Layout from '../components/Layout';

const Home = () => {
  const [found, setFound] = useState([]);
  const [create, setCreate] = useState(null);
  const [error, setError] = useState('');
  const [session, loading] = useSession();

  const search = async (code) => {
    if (!code || code.length < 3 || /^\s*$/.test(code)) return;
    console.log(`Searching for ${code}`);
    setFound([]);
    if (validbarcode(code)) {
      const response = await axios.get(`/api/produit/${code}`);
      console.log(response);
      if (!response.data?.code) {
        setCreate(code);
      } else {
        setFound([response.data]);
      }
    } else {
      console.log('Not a valid barcode, search for name');
      const response = await axios.get(`/api/search/${code}`);
      console.log(response);
      setFound(response.data);
    }
  };

  const deleteItem = async (item) => {
    const response = await axios.delete(`/api/produit/${item.code}`);
    if (response.data.ok) {
      setFound(found.filter((i) => i.code !== item.code));
    } else {
      setError(response.data.error);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Layout title="Rechercher un produit">
      {loading ? (
        <Spinner thickness="4px" color="teal.500" size="xl" />
      ) : (
        <>
          <Login loggedIn={!!session} />
          {!session ? null : (
            <>
              <SearchInput onSearch={search} />
              <List mt="2rem" w="100%" spacing={3}>
                {found?.map((item) => (
                  <ProductListItem
                    key={item.code}
                    item={item}
                    onDelete={deleteItem}
                  />
                ))}
              </List>
              {!create ? null : (
                <Box>
                  Produit non trouvé,{' '}
                  <Link color="teal.500" href={`/add/${create}`}>
                    le créer ?
                  </Link>
                </Box>
              )}
              {!error ? null : (
                <Alert mt="2rem" status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Home;
