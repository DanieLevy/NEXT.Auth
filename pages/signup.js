import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user && <AuthForm mode="signup" />}
    </>
  );
};

export default Signup;
