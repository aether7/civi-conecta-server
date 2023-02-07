function setDefaultEnv(key, defaultValue) {
  process.env[key] = process.env[key] ?? defaultValue;
}

setDefaultEnv('SEED_USER_LOGIN', 'seed-user-login');
setDefaultEnv('SEED_RECOVERY_PASSWORD', 'seed-recovery-password');
setDefaultEnv('SEED_SURVEY_STUDENTS', 'seed-survey-students');
setDefaultEnv('DATABASE_URL', 'mongodb://127.0.0.1:27017/civi-conecta-db');
setDefaultEnv('FTP_HOST', '127.0.0.1');
setDefaultEnv('FTP_PORT', 21);
setDefaultEnv('FTP_USER', 'anonymous');
setDefaultEnv('FTP_PASSWORD', 'guest');
setDefaultEnv('FTP_SECURE', false);
setDefaultEnv('TOKEN_EXPIRATION_USER_LOGIN', '7d');
setDefaultEnv('TOKEN_EXPIRATION_RECOVERY_PASSWORD', '7d');
setDefaultEnv('TOKEN_EXPIRATION_SURVEY_STUDENTS', '7d');
setDefaultEnv('SUBJECT_EMAIL_RECOVERY_PASSWORD', 'Recovery Password');
setDefaultEnv('SUBJECT_EMAIL_SURVEY_STUDENTS', 'Survey Students');
setDefaultEnv('NAME_TRANSPORTER_RECOVERY_PASSWORD', 'CiviConecta Support Team');
setDefaultEnv('NAME_TRANSPORTER_SURVEY_STUDENTS', 'CiviConecta Team');
setDefaultEnv('PORT', 3001);
setDefaultEnv('HOST_TRANSPORTER', '');
setDefaultEnv('PORT_TRANSPORTER', '');
setDefaultEnv('SECURE_TRANSPORTER', '');
setDefaultEnv('SERVICE_TRANSPORTER', '');
setDefaultEnv('USERNAME_TRANSPORTER', '');
setDefaultEnv('PASSWORD_TRANSPORTER', '');
setDefaultEnv('RECOVERY_PASSWORD_URL', '');
setDefaultEnv('SURVEY_STUDENTS_URL', '');
setDefaultEnv('AUTO_LOGIN_URL', '');
setDefaultEnv('PINO_LOG_LEVEL', 'info');
