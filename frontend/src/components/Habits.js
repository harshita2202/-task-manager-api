import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

function Habits() {
  const { token, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [message, setMessage] = useState('');

  // ✅ useCallback to avoid ESLint warning in useEffect
  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/habits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error('Error fetching habits:', err);
    }
  }, [token]);

  // ✅ Fetch habits when component loads
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async () => {
    const res = await fetch('http://localhost:5000/api/habits',
     
 {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newHabit }),
    });
    const data = await res.json();
    if (res.ok) {
      setHabits([...habits, data]);
      setNewHabit('');
      setMessage('Habit added!');
    } else {
      alert(data.error);
    }
  };

  const markComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessage(data.message);
    fetchHabits(); // Refresh the habit list
  };

const deleteHabit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      const parsed = text ? JSON.parse(text) : {};
      if (res.ok) {
        setMessage(parsed.message || 'Habit deleted');
        fetchHabits(); // refresh
      } else {
        setMessage(parsed.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Error deleting habit');
    }
  };




const editHabit = async (id, newName) => {
  const res = await fetch(`http://192.168.56.1:5000/api/habits/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newName }),
  });
   await res.json();
  setMessage('Habit updated');
  fetchHabits();
};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>Habit Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <p style={{ color: 'green' }}>{message}</p>

      <div>
        <input
          placeholder="New habit"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={addHabit} style={{ padding: '8px' }}>
          Add
        </button>
      </div>

      <ul style={{ marginTop: '20px' }}>
{habits.map(h => (
  <li key={h._id}>
    <input
      type="text"
      defaultValue={h.name}
      onBlur={(e) => editHabit(h._id, e.target.value)}
    />
    <span> (Streak: {h.streak}) </span>
    <button onClick={() => markComplete(h._id)}>Mark Today</button>
    <button onClick={() => deleteHabit(h._id)}>Delete</button>
  </li>
))}

      </ul>
    </div>
  );
}

export default Habits;
