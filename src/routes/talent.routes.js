const express = require('express');

const talentController = require('../controllers/talent.controller');

const talentRouter = express.Router();


talentRouter.post("/getTalentsByCategory", talentController.getListOfTalents)


exports.talentRouter = talentRouter