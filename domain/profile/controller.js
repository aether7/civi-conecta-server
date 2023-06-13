const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');

const getCurrentPlanning = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const user = await repositories.profile.getCurrentPlanning(teacherUUID);
  res.json({ ok:true, profile: dto.mapCurrentPlanification(user) });
};

const updateCurrentPlanning = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const updatedUser = await repositories.profile.updateCurrentPlanning(teacherUUID);
  res.json({ ok:true, profile: dto.mapCurrentPlanification(updatedUser) });
};

module.exports = wrapRequests({
  getCurrentPlanning,
  updateCurrentPlanning
});
