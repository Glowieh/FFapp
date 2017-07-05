var express = require('express');
var router = express.Router();

var campaignController = require('../controllers/campaign-controller');
var characterController = require('../controllers/character-controller');
var monsterController = require('../controllers/monster-controller');

router.get('/', function(req, res, next) {
  res.send('API root');
});

router.post('/campaign/', campaignController.create);
router.get('/campaign', campaignController.getAllBasic);
router.get('/campaign/:id', campaignController.getById);
router.put('/campaign/:id', campaignController.update);
router.delete('/campaign/:id', campaignController.delete);

router.post('/character/', characterController.create);
router.get('/character/campaign/:id', characterController.getByCampaignId);
router.put('/character/campaign/:id', characterController.updateByCampaignId);

router.post('/monster/', monsterController.create);
router.get('/monster/campaign/:id', monsterController.getByCampaignId);
router.put('/monster/:id', monsterController.update);
router.delete('/monster/:id', monsterController.delete);

module.exports = router;
