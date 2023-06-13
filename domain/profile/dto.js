const mapCurrentPlanification = (data) => {
  return {
    uuid: data.uuid,
    isCustomPlanification: Boolean(data.is_custom_planification)
  };
};

module.exports = {
  mapCurrentPlanification
};
