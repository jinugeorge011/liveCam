import React, { useState, useEffect } from 'react';

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [serverStatus, setServerStatus] = useState('Loading...');
  const [recentActivities, setRecentActivities] = useState([]);

  // Simulate fetching data from an API
  useEffect(() => {
    // Simulated data fetching
    setTimeout(() => {
      setUserCount(1200);
      setActiveSessions(45);
      setServerStatus('All systems operational');
      setRecentActivities([
        'User JohnDoe started a session.',
        'User JaneDoe ended a session.',
        'User Mike123 was flagged for inappropriate behavior.'
      ]);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>Admin Overview</h1>
      <section>
        <h2>System Status</h2>
        <p><strong>Server Status:</strong> {serverStatus}</p>
        <p><strong>Total Users:</strong> {userCount}</p>
        <p><strong>Active Video Sessions:</strong> {activeSessions}</p>
      </section>

      <section>
        <h2>Recent Activities</h2>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Actions</h2>
        <button onClick={() => alert('Managing users...')}>Manage Users</button>
        <button onClick={() => alert('Viewing reports...')}>View Reports</button>
        <button onClick={() => alert('Server diagnostics...')}>Run Diagnostics</button>
      </section>
    </div>
  );
};

export default AdminOverview;
