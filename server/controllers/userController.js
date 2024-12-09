// const user = require('../models/Status');

// const fetchUserStats = async (req, res) => {
//   try {
//     // Extract filters from request query or body if needed
//     const { startDate, endDate } = req.query;

//     // Build a filter object based on dates
//     const filter = {};
//     if (startDate && endDate) {
//       filter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     // Fetch statistics from the database
//     const totalUsers = await user.countDocuments(filter);
//     const activeUsers = await user.countDocuments({ ...filter, isActive: true });
//     const inactiveUsers = await user.countDocuments({ ...filter, isActive: false });

//     // Send the stats in the response
//     res.status(200).json({
//       success: true,
//       data: {
//         totalUsers,
//         activeUsers,
//         inactiveUsers,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching user stats:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// module.exports = { fetchUserStats };
