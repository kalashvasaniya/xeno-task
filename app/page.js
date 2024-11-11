"use client";
import { useState } from "react";

export default function Home() {

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert('Customer added successfully!');
    } else {
      alert('Failed to add customer bro!');
    }
  };


  return (
    <>
      <div className="bg-black text-white">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} className="text-black block border mb-2 p-2 w-full" />
            <input name="email" placeholder="Email" onChange={handleChange} className="text-black block border mb-2 p-2 w-full" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="text-black block border mb-2 p-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Customer</button>
          </form>
        </div>

      </div>
    </>
  );
}
