import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [connectionStatus, setConnectionStatus] = useState<null | 'ok' | 'fail'>(null);

  useEffect(() => {
    (async () => {
      try {
        // Try a simple fetch to the REST API root, which always works if Supabase is up
        const url = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
        const res = await fetch(url + '/rest/v1/', { method: 'GET' });
        setConnectionStatus(res.ok ? 'ok' : 'fail');
      } catch {
        setConnectionStatus('fail');
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 16 }}>
      <h1>Vite + React + Supabase</h1>
      <div style={{ marginBottom: 16 }}>
        <b>Supabase connection status: </b>
        {connectionStatus === null && <span>Checking...</span>}
        {connectionStatus === 'ok' && <span style={{color: 'green'}}>Connected</span>}
        {connectionStatus === 'fail' && <span style={{color: 'red'}}>Not connected</span>}
      </div>
    </div>
  );
}

export default App;

