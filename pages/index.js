
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function Home() {
  const [status, setStatus] = useState('Checking server connection...');

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Failed to connect to server'));
  }, []);

  return (
    <div className="container">
      <h1>Server Connection Status</h1>
      <p>{status}</p>

    </div>
  );
}
