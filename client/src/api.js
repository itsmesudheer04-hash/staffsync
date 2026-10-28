// one helper for every call to the backend; it adds the login token automatically
export async function api(path, method = 'GET', body) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
export const todayStr = () => new Date().toLocaleDateString('en-CA');
export const timeStr = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—');
export const dateStr = (d) => new Date(d).toLocaleDateString();
