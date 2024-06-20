import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            {!user && <AuthForm mode="login" />}
        </>
    );
};

export default Login;
