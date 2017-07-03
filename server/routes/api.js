var express = require('express');
var router = express.Router();

var campaignController = require('../controllers/campaign-controller');
var characterController = require('../controllers/character-controller');

router.get('/', function(req, res, next) {
  res.send('API root');
});

router.get('/campaign', campaignController.getAll);
router.get('/campaign/:id', campaignController.getById);

router.get('/character/:id', characterController.getById);

module.exports = router;
