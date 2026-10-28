import { useEffect, useState } from 'react';
import { api, getUser, todayStr, timeStr } from '../api.js';

export default function Attendance() {
  const isAdmin = getUser().role === 'admin';
  const [date, setDate] = useState(todayStr());
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api(isAdmin ? '/attendance?date=' + date : '/attendance/mine').then(setRows);
  }, [date, isAdmin]);

  return (
    <>
      <h1>Attendance</h1>
      {isAdmin && <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
      <div className="card">
        <table>
          <thead>
            <tr>{isAdmin ? <><th>Name</th><th>Department</th></> : <th>Date</th>}<th>Check in</th><th>Check out</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                {isAdmin ? <><td>{r.user?.name}</td><td>{r.user?.department}</td></> : <td>{r.date}</td>}
                <td>{timeStr(r.checkIn)}</td><td>{timeStr(r.checkOut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p>No records.</p>}
      </div>
    </>
  );
}
