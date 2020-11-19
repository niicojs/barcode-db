import { GoMarkGithub } from 'react-icons/go';
import { Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/client';

const Login = ({ loggedIn }) => {
  if (loggedIn) return null;
  return (
    <Button
      leftIcon={<GoMarkGithub />}
      colorScheme="teal"
      variant="solid"
      onClick={() => signIn('github')}
    >
      Se connecter
    </Button>
  );
};

export default Login;
