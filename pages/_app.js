import { useEffect } from 'react';
import { useRouter } from 'next/router';
import "../styles/visits.css";
import "../styles/navbar.css";
import "../styles/login.css"

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoginPage = router.pathname === '/login';

    if (!token && !isLoginPage) {
      router.replace('/login');
    } else if (token && isLoginPage) {
      router.replace('/');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
