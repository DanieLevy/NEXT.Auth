import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import SignInWithGoogle from './SignInWithGoogle';
import { useRouter } from 'next/router';


const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const { login, user } = useContext(AuthContext);

  const router = useRouter();
  // get the url query (/login or /signup) and log it

  const url = router.asPath;
  const urlMode = url.slice(1);


  const [mode, setMode] = useState(urlMode || 'login');

  useEffect(() => {
    // handle url change to set the mode
    // if user, kick to home
    if (user) {
      router.push('/');
    }
    setMode(urlMode);
  }, [router.asPath]);

  function handleModeChange() {
    setMode(mode === 'login' ? 'signup' : 'login');
    router.push(`/${mode === 'login' ? 'signup' : 'login'}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { username, password };
    if (mode === 'signup') {
      body.email = email;
      body.name = name;

    }

    console.log('body:', body);
    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, stayLoggedIn); // Pass the token and stayLoggedIn to login
        toast.success(`Successfully ${mode === 'login' ? 'logged in' : 'signed up'}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error happened');
    }
  };

  const handleImageChange = (e) => {
    // upload the image to cloudinary and set the image state
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'next-auth');
    fetch('https://api.cloudinary.com/v1_1/dzqowgj6i/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setImage(data.secure_url);
      })
      .catch((err) => console.error(err));
  }



  return (
    <>
      <div className='auth-container'>
        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="auth-form__title">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
          <div className='auth_inputs'>
            <h2 className='username'>Username</h2>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-form__input"
            />
          </div>
          <div className='auth_inputs'>
            <h2 className='password'>Password</h2>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-form__input"
            />
          </div>
          <div className={`auth_inputs ${mode === 'login' ? 'hidden' : ''}`}>
            <h2 className="email">Email</h2>
            <input
              type="email"
              required={mode === 'signup'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-form__input"
            />
          </div>
          <div className={`auth_inputs name ${mode === 'login' ? 'hidden' : ''}`}>
            <h2 className="name">Name</h2>
            <input
              type="text"
              required={mode === 'signup'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-form__input"
            />
          </div>
          <div className={`divider spacer ${mode === 'login' ? 'hidden' : ''}`}>
            <span className="divider__line"></span>
            </div>

          { mode === 'login' && (
          <div className='auth_options'>
            <div className="auth-form__checkbox">
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={() => setStayLoggedIn(!stayLoggedIn)}
                className="auth-form__checkbox-input"
              />
              <label className="auth-form__checkbox-label">Keep me logged in</label>
            </div>
            <div className='forget_password'>
              <a href='/forget_password'>Forget Password?</a>
            </div>
          </div>
          )}
          <SignInWithGoogle />
          <button type="submit" className="auth-form__button">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
          <div className="divider">
            <span className="divider__line"></span>
            <a className="divider__link" 
              onClick={handleModeChange}
            >
              {mode === 'login' ? 'or Sign up' : 'or Log in'}
            </a>
            <span className="divider__line"></span>
          </div>
        </form>
      </div>
    </> 
  );
}

export default AuthForm;
