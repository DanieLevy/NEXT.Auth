import React, { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

function SignInWithGoogle() {
    const { login } = useContext(AuthContext);

    const checkUser = async (userCreds) => {
        const response = await fetch('/api/checkUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCreds),
        });
    
        const data = await response.json();
        return data;
    };

    async function signInWithGoogle() {
        try {
            console.log("Starting sign in with Google...");

            const provider = new GoogleAuthProvider();
            console.log("Created GoogleAuthProvider instance.");

            const result = await signInWithPopup(auth, provider);
            console.log("Successfully signed in with Google.");

            const user = result.user;
            console.log("User credentials:", user);
            if (user) {
                const userCreds = {
                    name: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                };
                console.log("User credentials:", userCreds);
                const userExists =       await checkUser(userCreds);
                console.log("User exists:", userExists);
                login(userExists.token, true);
            }
        }
        catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }

    return (
        <div className="google-container">
            <FcGoogle />
            <button
                onClick={signInWithGoogle}
                type="button"
                className="google-signin">
                Sign in with Google
            </button>
        </div>
    );
}

export default SignInWithGoogle;
