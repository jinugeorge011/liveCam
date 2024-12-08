// src/components/AnalyticsCard.jsx
import React from 'react';

const AnalyticsCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-2xl font-bold text-teal-500 mt-2">{value}</p>
    </div>
  );
};

export default AnalyticsCard;
