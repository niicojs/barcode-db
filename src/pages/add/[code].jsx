import { useState, useEffect } from 'react';
import {
  chakra,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { MdSave } from 'react-icons/md';
import { useRouter } from 'next/router';

import axios from 'axios';
import { useForm } from 'react-hook-form';

import Layout from '../../components/Layout';

const SaveIcon = () => <Icon as={MdSave} />;

export default function Add() {
  const router = useRouter();
  const { code } = router.query;
  const [error, setError] = useState('');
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      code: '',
      name: '',
      chronoid: '',
    },
  });

  useEffect(() => {
    if (code) setValue('code', code);
  }, [code]);

  const save = async (data) => {
    const response = await axios.post(`/api/produit/${data.code}`, data);
    console.log(response.data);
    if (response.data.ok) {
      window.location.replace('/');
    } else {
      setError(response.data.error);
    }
  };

  return (
    <Layout title="Ajouter un produit">
      <chakra.form w="100%" onSubmit={handleSubmit(save)}>
        <FormControl isRequired>
          <FormLabel>Code barre</FormLabel>
          <Input
            name="code"
            placeholder="code"
            required
            ref={register}
            isInvalid={!!errors.code}
            my="0.3rem"
          />
        </FormControl>
        <FormControl isRequired mt="1rem">
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
        <FormControl mt="1rem">
          <FormLabel>ID Chronodrive</FormLabel>
          <Input
            name="chronoid"
            placeholder="id"
            ref={register}
            isInvalid={!!errors.chronoid}
            my="0.3rem"
          />
        </FormControl>

        <Button
          type="submit"
          leftIcon={<SaveIcon />}
          colorScheme="teal"
          variant="solid"
          my="1rem"
        >
          Créer
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
