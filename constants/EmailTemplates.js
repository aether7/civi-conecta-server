const templates = {
  recoverPassword(name, password) {
    return `
      <p>Hola ${name}</p>
      <p>Esta es tu nueva clave para ingresar a civiconecta.cl: ${password}</p>
      <p>Atte. Equipo civiconecta.cl</p>
    `;
  }
};

module.exports = templates;
