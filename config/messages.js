const messages = {
  auth: {
    notValid: 'El correo y/o clave son incorrectas',
    recoverPassword: 'Revisa tu correo para recuperar tu nueva password',
    logout: 'Te has desconectado exitosamente',
    noStudent: 'El RUT que ingresaste, no coincide con ningun estudiante. Verifica si esta bien escrito e inténtalo nuevamente'
  },
  unit: {
    alreadyExists: 'La unidad ya existe',
    canNotDeleteUnit: 'La unidad no se puede borrar porque tiene {} clases asociadas',
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
    canNotDeleteTopic: 'El tema no se puede borrar porque tiene {} preguntas asociadas'
  },
  question: {
    canNotDeleteQuestion: 'La pregunta ya tiene respuestas asociadas en una encuesta'
  }
};

module.exports = messages;
