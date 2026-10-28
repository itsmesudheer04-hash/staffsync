import { useEffect, useState } from 'react';
import { api } from '../api.js';

const empty = { name: '', email: '', department: '', position: '', phone: '' };

export default function Employees() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api('/employees').then(setList);
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api('/employees/' + editingId, 'PUT', form);
      else await api('/employees', 'POST', form);
      setMsg(editingId ? 'Employee updated' : 'Employee added (default password: welcome123)');
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const edit = (emp) => {
    setEditingId(emp._id);
    setForm({ name: emp.name, email: emp.email, department: emp.department || '', position: emp.position || '', phone: emp.phone || '' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this employee and their records?')) return;
    await api('/employees/' + id, 'DELETE');
    load();
  };

  return (
    <>
      <h1>Employees</h1>
      <form className="card" onSubmit={save}>
        <h3>{editingId ? 'Edit employee' : 'Add employee'}</h3>
        <div className="row">
          <input name="name" placeholder="Name" value={form.name} onChange={change} />
          <input name="email" placeholder="Email" value={form.email} onChange={change} disabled={!!editingId} />
        </div>
        <div className="row">
          <input name="department" placeholder="Department" value={form.department} onChange={change} />
          <input name="position" placeholder="Position" value={form.position} onChange={change} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={change} />
        </div>
        {msg && <p className="muted">{msg}</p>}
        <div className="row">
          <button type="submit">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="grey" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th></th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td><td>{e.email}</td><td>{e.department}</td><td>{e.position}</td>
                <td>
                  <button className="small" onClick={() => edit(e)}>Edit</button>
                  <button className="small red" onClick={() => remove(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p>No employees yet.</p>}
      </div>
    </>
  );
}
