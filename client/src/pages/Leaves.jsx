import { useEffect, useState } from 'react';
import { api, getUser, dateStr } from '../api.js';

export default function Leaves() {
  const isAdmin = getUser().role === 'admin';
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: 'Casual', fromDate: '', toDate: '', reason: '' });
  const [msg, setMsg] = useState('');

  const load = () => api(isAdmin ? '/leaves' : '/leaves/mine').then(setLeaves);
  useEffect(() => { load(); }, []);

  const apply = async (e) => {
    e.preventDefault();
    try {
      await api('/leaves', 'POST', form);
      setMsg('Leave request sent');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const decide = async (id, status) => {
    try { await api('/leaves/' + id, 'PATCH', { status }); } catch (err) { setMsg(err.message); }
    load();
  };

  return (
    <>
      <h1>Leaves</h1>
      {!isAdmin && (
        <form className="card" onSubmit={apply}>
          <h3>Apply for leave</h3>
          <div className="row">
            <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Casual</option><option>Sick</option><option>Earned</option>
            </select>
            <input type="date" onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
            <input type="date" onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
          </div>
          <input placeholder="Reason" onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          {msg && <p className="muted">{msg}</p>}
          <button type="submit">Send request</button>
        </form>
      )}
      {isAdmin && msg && <p className="error">{msg}</p>}

      <div className="card">
        <table>
          <thead><tr>{isAdmin && <th>Employee</th>}<th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th>{isAdmin && <th></th>}</tr></thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                {isAdmin && <td>{l.user?.name}</td>}
                <td>{l.type}</td><td>{dateStr(l.fromDate)}</td><td>{dateStr(l.toDate)}</td><td>{l.reason}</td>
                <td><span className={'pill ' + l.status}>{l.status}</span></td>
                {isAdmin && (
                  <td>
                    {l.status === 'pending' && (
                      <>
                        <button className="small" onClick={() => decide(l._id, 'approved')}>Approve</button>
                        <button className="small red" onClick={() => decide(l._id, 'rejected')}>Reject</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {leaves.length === 0 && <p>No leave requests.</p>}
      </div>
    </>
  );
}
