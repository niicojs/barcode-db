import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { List, Box, Link } from '@chakra-ui/react';
import axios from 'axios';
import validbarcode from 'barcode-validator';

import Login from '../components/Login';
import SearchInput from '../components/SearchInput';
import ProductListItem from '../components/ProductListItem';
import Layout from '../components/Layout';

const Home = () => {
  const [found, setFound] = useState([]);
  const [create, setCreate] = useState(null);
  const [session, loading] = useSession();
  const search = async (code) => {
    if (!code || /^\s*$/.test(code)) return;
    console.log(`Searching for ${code}`);
    if (validbarcode(code)) {
      const response = await axios.get(`/api/produit/${code}`);
      setFound([response.data]);
      if (!response.data) {
        setCreate(code);
      }
    } else {
      console.log('Not a valid barcode, search for name');
      const response = await axios.get(`/api/search/${code}`);
      setFound(response.data);
    }
  };

  return (
    <Layout title="Rechercher un produit">
      {loading ? null : (
        <>
          <Login loggedIn={!!session} />
          {!session ? null : (
            <>
              <SearchInput onSearch={search} />
              <List mt="2rem" w="100%" spacing={3}>
                {found?.map((item) => (
                  <ProductListItem key={item.code} item={item} />
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
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Home;
