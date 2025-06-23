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
          <li key={h._id} style={{ marginBottom: '10px' }}>
            <strong>{h.name}</strong> (Streak: {h.streak}){' '}
            <button onClick={() => markComplete(h._id)}>Mark Today</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Habits;
