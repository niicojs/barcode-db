import { useState } from 'react';
import {
  chakra,
  Box,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { MdSave } from 'react-icons/md';

import axios from 'axios';
import { useForm } from 'react-hook-form';

import formatDistance from 'date-fns/formatDistance';
import isBefore from 'date-fns/isBefore';
import format from 'date-fns/format';
import subMonths from 'date-fns/subMonths';
import { fr } from 'date-fns/locale';

import Layout from '../../components/Layout';

const SaveIcon = () => <Icon as={MdSave} />;
const formatDate = (strdate) => {
  const date = new Date(strdate);
  if (isBefore(date, subMonths(new Date(), 1))) {
    return 'le ' + format(date, 'dd/MM/yyyy');
  } else {
    return formatDistance(date, new Date(), {
      addSuffix: true,
      locale: fr,
    });
  }
};

export default function Edit({ item }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      code: item.code,
      name: item.name,
    },
  });

  const save = async (data) => {
    const response = await axios.post(`/api/produit/${item.code}`, data);
    console.log(response.data);
    if (response.data.ok) {
      window.location.replace('/');
    } else {
      setError(response.data.error);
    }
  };

  return (
    <Layout title="Modifier un produit">
      <chakra.form w="100%" onSubmit={handleSubmit(save)}>
        <FormControl isRequired>
          <FormLabel>Code barre</FormLabel>
          <Input
            name="code"
            placeholder="code"
            readOnly
            required
            ref={register}
            isInvalid={!!errors.code}
            my="0.3rem"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Nom</FormLabel>
          <Input
            name="name"
            placeholder="nom"
            required
            ref={register}
            isInvalid={!!errors.name}
            my="0.3rem"
          />
        </FormControl>

        <Box fontSize="small" color="gray.400">
          Créé {formatDate(item.createdAt)}
        </Box>
        <Box fontSize="small" color="gray.400">
          Modifié {formatDate(item.modifiedAt)}
        </Box>
        <Button
          type="submit"
          leftIcon={<SaveIcon />}
          colorScheme="teal"
          variant="solid"
          my="1rem"
        >
          Enregistrer
        </Button>
      </chakra.form>

      {!error ? null : (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const code = context.params.code;
    const base = process.env.NEXTAUTH_URL;
    const item = await axios
      .get(`${base}/api/produit/${code}`)
      .then((res) => res.data[0]);
    console.log(item);
    return {
      props: { item },
    };
  } catch (error) {
    console.error(error);
    context.res.statusCode = 302;
    context.res.setHeader('Location', `/`);
    return { props: {} };
  }
}
