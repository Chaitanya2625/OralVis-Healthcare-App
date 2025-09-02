import { useEffect, useState } from 'react';
import api from '../services/api';
import ScanList from '../components/ScanList';

export default function DentistDashboard() {
  const [scans, setScans] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/scans');
      setScans(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load scans');
    }
  };

  useEffect(() => { load(); }, []);

  const viewPdf = (id) => {
    // open file download
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${apiUrl}/reports/${id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dentist — Scan Viewer</h1>
        <button className="btn" onClick={load}>Refresh</button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <ScanList scans={scans} onViewPdf={viewPdf}/>
    </div>
  );
}
