//GET visit history for a specific pet
router.get('/pet/:petId', async (req, res) => {
  try {
    const historyRecords = await DailyHistory.find({ 'checkIns.petId': req.params.petId }).sort({ date: -1 });

    const petVisits = [];
    historyRecords.forEach(day => {
      day.checkIns.forEach(checkin => {
        if (checkin.petId.toString() === req.params.petId) {
          petVisits.push({
            date: day.date,
            petId: checkin.petId,
            petName: checkin.petName,
            customerName: checkin.customerName,
            phoneNumber: checkin.phoneNumber,
            paymentMethod: checkin.paymentMethod,
            totalPrice: checkin.totalPrice,
            tipPrice: checkin.tipPrice,
          });
        }
      });
    });

    res.json(petVisits);
  } catch (error) {
    console.error('Error fetching history for pet:', error);
    res.status(500).json({ error: 'Server error fetching pet history' });
  }
});