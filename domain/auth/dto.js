const mapUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active
  };
};

module.exports = {
  mapUser
};
