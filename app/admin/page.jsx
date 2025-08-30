'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // runs only once

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Admin Dashboard {user.firstName} {user.lastName}!
      </h1>
      <p className="text-gray-700">
        Use the sidebar to navigate to different management pages for courses, students, and instructors.
      </p>
    </div>
  );
}
