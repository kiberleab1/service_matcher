const express = require("express");
const userProfile = require("../controllers/userProfile.controller");
const talentController = require("../controllers/talent.controller");

const talentRouter = express.Router();

talentRouter.post("/getTalentsByCategory", talentController.getListOfTalents);

talentRouter.post("/registerTalent", userProfile.registerTalent);
talentRouter.put("/updateProfile", userProfile.updateProfile);
exports.talentRouter = talentRouter;
