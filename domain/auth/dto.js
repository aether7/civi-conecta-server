const mapUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    active: !!user.active,
    password: user.password,
    uuid: user.uuid,
    isCustomPlanification: !!user.is_custom_planification
  };
};

module.exports = {
  mapUser
};
