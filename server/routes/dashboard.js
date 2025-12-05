const express = require('express');
const router = express.Router();
const CheckIn = require('../models/Checkin');
const DailyHistory = require('../models/Dailyhistory');

// GET /api/dashboard/today
router.get('/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCompleted = await DailyHistory.find({
      checkOutTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalRevenue = todayCompleted.reduce((sum, record) => sum + record.totalPrice , 0);

    const completedCount = todayCompleted.length || 0;

    const activeCheckIns = await CheckIn.countDocuments({ status: 'in-progress' }) || 0;

      res.json({
        totalRevenue,
        completedCount,
        activeCheckIns
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
