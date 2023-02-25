const messages = {
  auth: {
    notValid: 'El correo y/o clave son incorrectas',
    recoverPassword: 'Revisa tu correo para recuperar tu nueva password',
    logout: 'Te has desconectado exitosamente'
  },
  unit: {
    alreadyExists: 'La unidad ya existe',
    hasAssociatedClass: 'La unidad ya tiene al menos una clase asociada',
    unitRemoved: 'La unidad ha sido removida exitosamente'
  },
  establishment: {
    teacherAlreadyAssigned: 'Este profesor ya tiene un curso asignado, intenta con otro profesor',
    teacherAssigned: 'El profesor fue asignado exitosamente'
  },
  survey: {
    typeNotFound: 'Se debe elegir un tipo de encuesta tipo estudiante o profesor',
    created: 'La encuesta se ha creado exitosamente'
  },
  topic: {
    canNotDeleteTopic: 'El tema no se puede borrar porque tiene {}',
    studentQuestions: '{} preguntas de estudiante',
    teacherQuestions: '{} preguntas de profesor'
  }
};

module.exports = messages;
