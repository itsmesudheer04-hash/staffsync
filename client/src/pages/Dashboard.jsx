import { useEffect, useState } from 'react';
import { api, getUser, timeStr } from '../api.js';

function AdminDash() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/employees/stats').then(setStats); }, []);
  if (!stats) return <p>Loading...</p>;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="card stat"><span>{stats.total}</span>Employees</div>
        <div className="card stat"><span>{stats.present}</span>Present today</div>
        <div className="card stat"><span>{stats.pending}</span>Pending leaves</div>
      </div>
      <div className="card">
        <h3>Employees by department</h3>
        {stats.byDept.map((d) => <p key={d._id}>{d._id}: <strong>{d.count}</strong></p>)}
      </div>
    </>
  );
}

function EmployeeDash() {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const load = () => api('/attendance/today').then(setRecord);
  useEffect(() => { load(); }, []);

  const act = async (path) => {
    setError('');
    try { await api('/attendance/' + path, 'POST'); load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <>
      <h1>Welcome, {getUser().name}</h1>
      <div className="card">
        <h3>Today's attendance</h3>
        <p>Check in: <strong>{timeStr(record?.checkIn)}</strong> | Check out: <strong>{timeStr(record?.checkOut)}</strong></p>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button disabled={!!record} onClick={() => act('checkin')}>Check In</button>
          <button disabled={!record || !!record.checkOut} onClick={() => act('checkout')}>Check Out</button>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  return getUser().role === 'admin' ? <AdminDash /> : <EmployeeDash />;
}
