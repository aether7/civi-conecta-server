const repositories = require('../../repositories');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const getFeedback = async (req, res) => {
  const alias = req.params.aliasId;
  const surveyType = req.params.surveyType;
  const feedback = await repositories.feedback.findOrCreateByType(surveyType, alias);
  const result = await repositories.survey.findWithDataByType(surveyType);

  res.json({
    ok: true,
    feedback: dto.mapFeedback(feedback),
    survey: dto.mapSurvey(result)
  });
};

module.exports = {
  getFeedback: tryCatch(getFeedback)
};
