import { useState } from 'react';
import api from '../services/api';
import { auth } from '../services/auth';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('tech@oralvis.com'); // convenience defaults
  const [password, setPassword] = useState('tech123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      auth.set(data.token, data.role);
      onSuccess?.(data.role);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-3">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email}
          onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" value={password}
          onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-xs text-gray-500">
        Demo users: <br/>
        Technician — tech@oralvis.com / tech123<br/>
        Dentist — dentist@oralvis.com / dentist123
      </p>
    </form>
  );
}
