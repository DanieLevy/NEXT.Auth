import * as Imports from '../imports';
import '../styles/style.scss';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {

  return (
    <Imports.AuthProvider>
      <Imports.NavBar />
      <Component {...pageProps} />
          <ToastContainer
    position="bottom-right"
    autoClose={2000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition={Bounce}
    />
        </Imports.AuthProvider>
  );
}

export default MyApp;
