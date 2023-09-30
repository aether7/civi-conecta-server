const mapUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    active: !!user.user_active,
    password: user.password,
    uuid: user.user_uuid,
    isCustomPlanification: !!user.is_custom_planification
  };
};

module.exports = {
  mapUser
};
