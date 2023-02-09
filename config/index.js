const getEnv = (key, defaultValue) => process.env[key] ?? defaultValue;

const config = {
  env: {
    port: getEnv('PORT', 3001),
    logLevel: getEnv('PINO_LOG_LEVEL', 'info'),
    host: getEnv('HOST', '0.0.0.0')
  },
  seed: {
    userLogin: getEnv('SEED_USER_LOGIN', 'seed-user-login'),
    recoverPassword: getEnv('SEED_RECOVERY_PASSWORD', 'seed-recovery-password'),
    surveyStudents: getEnv('SEED_SURVEY_STUDENTS', 'seed-survey-students')
  },
  database: {
    mongo: {
      url: getEnv('DATABASE_URL', 'mongodb://127.0.0.1:27017/civi-conecta-db')
    }
  },
  ftp: {
    host: getEnv('FTP_HOST', '127.0.0.1'),
    port: getEnv('FTP_PORT', 21),
    user: getEnv('FTP_USER', 'anonymous'),
    password: getEnv('FTP_PASSWORD', 'guest'),
    secure: getEnv('FTP_SECURE', false)
  },
  token: {
    expiration: {
      userLogin: getEnv('TOKEN_EXPIRATION_USER_LOGIN', '7d'),
      recoveryPassword: getEnv('TOKEN_EXPIRATION_RECOVERY_PASSWORD', '7d'),
      surveyStudents: getEnv('TOKEN_EXPIRATION_SURVEY_STUDENTS', '7d')
    }
  },
  email: {
    template: {
      subject: {
        recoveryPassword: getEnv('SUBJECT_EMAIL_RECOVERY_PASSWORD', 'Recovery Password'),
        surveyStudents: getEnv('SUBJECT_EMAIL_SURVEY_STUDENTS', 'Survey Students')
      }
    },
    transport: {
      name: {
        recoveryPassword: getEnv('NAME_TRANSPORTER_RECOVERY_PASSWORD', 'CiviConecta Support Team'),
        surveyStudents: getEnv('NAME_TRANSPORTER_SURVEY_STUDENTS', 'CiviConecta Team')
      },
      host: getEnv('HOST_TRANSPORTER', ''),
      port: getEnv('PORT_TRANSPORTER', ''),
      secure: getEnv('SECURE_TRANSPORTER', ''),
      service: getEnv('SERVICE_TRANSPORTER', ''),
      username: getEnv('USERNAME_TRANSPORTER', ''),
      password: getEnv('PASSWORD_TRANSPORTER', '')
    }
  },
  urls: {
    recoveryPassword: getEnv('RECOVERY_PASSWORD_URL', ''),
    surveyStudents: getEnv('SURVEY_STUDENTS_URL', ''),
    autoLogin: getEnv('AUTO_LOGIN_URL', '')
  }
};

module.exports = config;
