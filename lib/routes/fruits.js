let express = require('express');
const router = express.Router();
const db = require('../api/fruits');

router.use(express.static('fruits'));
router.get('/api', async (req, res) => {
  res.json(data);
});
module.exports = router;
