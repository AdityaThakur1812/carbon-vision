import React, { useState } from 'react';
import api from '../services/api';

const Home = () => {
  const [data, setData] = useState({ transport: 0, energy: 0, food: 0, waste: 0 });

  const handleChange = e => {
    setData({ ...data, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userId = 'USER_ID_HERE'; // Replace with actual logged-in user id
      const res = await api.post('/activities', { ...data, userId });
      console.log(res.data);
      alert('Activity saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving activity');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daily Carbon Footprint</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['transport', 'energy', 'food', 'waste'].map(field => (
          <div key={field}>
            <label className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="number"
              name={field}
              value={data[field]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Home;
