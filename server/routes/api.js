var express = require('express');
var router = express.Router();

var campaignController = require('../controllers/campaign-controller');
var characterController = require('../controllers/character-controller');

router.get('/', function(req, res, next) {
  res.send('API root');
});

router.post('/campaign/:id/auth', campaignController.authenticateCampaign);
router.post('/campaign/', campaignController.create);
router.get('/campaign', campaignController.getAllBasic);
router.get('/campaign/:id', campaignController.getById);
router.put('/campaign/:id', campaignController.update);

router.post('/character/', characterController.create);

module.exports = router;
