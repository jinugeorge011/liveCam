import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js to work
import { fetchUserStatsAPI, getAllUsersAPI } from '../../../services/allAPIs'; // Example APIs

const Users = () => {
  const [userStats, setUserStats] = useState(null); // Data for the chart
  const [users, setUsers] = useState([]); // User details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To capture any errors

  // Place the fetchData function inside the useEffect hook
  const fetchData = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      // Make the API calls here
      const stats = await fetchUserStatsAPI(); // API to fetch user stats
      const userList = await getAllUsersAPI(); // API to fetch all user details
      setUserStats(stats);
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once when the component mounts

  // Chart configuration
  const chartData = {
    labels: userStats?.map((stat) => stat.month) || [],
    datasets: [
      {
        label: 'New Users',
        data: userStats?.map((stat) => stat.newUsers) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-purple-800 mb-6">User Management</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : (
        <>
          {/* Chart Section */}
          {userStats && userStats.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly New Users</h2>
              <div className="w-full h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* User Details Table */}
          {users.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-purple-50">
                        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2 capitalize">{user.role}</td>
                        <td className="border border-gray-300 px-4 py-2">{new Date(user.joined).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fallback for empty data */}
          {users.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-lg text-gray-600">No users found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
