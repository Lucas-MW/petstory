const express = require('express');
const router = express.Router();
const DailyHistory = require('../models/Dailyhistory');

//GET api/reports
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Start of the day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    const reportData = await DailyHistory.find({
      checkOutTime: { $gte: start, $lte: end }, status: 'completed'
    });

    const totalRevenue = reportData.reduce((sum, record) => sum + record.totalPrice, 0);

    //breakdown by payment method
    const paymentMethodBreakdown = reportData.reduce((acc, record) => {
      const method = record.paymentMethod || 'other';
      acc[method].total += record.totalPrice;
      acc[method].count += 1;
      return acc;
    },{
      cash: { total: 0, count: 0 },
      card: { total: 0, count: 0 },
      zelle: { total: 0, count: 0 },
      venmo: { total: 0, count: 0 },
      other: { total: 0, count: 0 }
    });

    res.json({
      totalRevenue,
      paymentMethod: {
        cash: paymentMethodBreakdown.cash.total,
        card: paymentMethodBreakdown.card.total,
        zelle: paymentMethodBreakdown.zelle.total,
        venmo: paymentMethodBreakdown.venmo.total,
        other: paymentMethodBreakdown.other.total
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Server error generating report' });
  }
});

module.exports = router;

