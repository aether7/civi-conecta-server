INSERT INTO user(name, email, password, encrypted_password, active, role) VALUES('Mrs. Ashley Aguilar', 'ashley.aguilar@mailinator.com', 'ashley.aguilar', 0, 1, 'User');

INSERT INTO establishment(name, active) VALUES('st peter', 1);

INSERT INTO course(letter_id, establishment_id, grade_id, teacher_id) VALUES(3, 1, 7, 3);

INSERT INTO student(name, run) VALUES ('Rachel Booker', '32514884-5'), ('Daniel Parker', '55421583-1'), ('Vickie Sullivan', '24096613-1'), ('Lauren Arellano', '79077443-4'), ('Alexandra Herrera', '16455017-6');

INSERT INTO course_student(course_id, student_id) VALUES (1, 1),(1, 2),(1, 3),(1, 4),(1, 5);

INSERT INTO topic(title, number) VALUES ('programacion', 1);

INSERT INTO survey(number, type, topic_id) VALUES(1, 'student', 1);
INSERT INTO survey(number, type, topic_id) VALUES(1, 'teacher', 1);

INSERT INTO question(survey_id, description) VALUES(1, 'con que lenguaje se desarrollo esta aplicacion?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'A', 1, 'Node JS');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'B', 2, 'Java');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'C', 0, 'Javascript');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'D', 1, 'React');

INSERT INTO question(survey_id, description) VALUES(1, 'que base de datos se esta utilizando?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'A', 2, 'ninguna de las anteriores');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'B', 0, 'PostgreSQL');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'C', 1, 'SQLite');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'D', 1, 'MongoDB');

INSERT INTO question(survey_id, description) VALUES(1, 'que paradigma de programacion es invalido?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'A', 2, 'programacion orientada a objetos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'B', 1, 'programacion orientada a aspectos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'C', 1, 'programacion orientada a restricciones');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'D', 0, 'ninguna de las anteriores');

INSERT INTO question(survey_id, description) VALUES(1, 'cual de todos estos no es un lenguaje de programacion');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'A', 0, 'SQL');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'B', 1, 'Lua');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'C', 1, 'Zig');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'D', 2, 'Python');

INSERT INTO question(survey_id, description) VALUES(1, 'cual de estos lenguajes tiene el mejor manejo de la memoria');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'A', 1, 'rust');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'B', 0, 'C');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'C', 2, 'Java');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'D', 2, 'Javascript');


INSERT INTO question(survey_id, description) VALUES(2, 'con que lenguaje se desarrollo esta aplicacion?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'A', 1, 'Node JS');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'B', 2, 'Java');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'C', 0, 'Javascript');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'D', 1, 'React');

INSERT INTO question(survey_id, description) VALUES(2, 'que base de datos se esta utilizando?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'A', 2, 'ninguna de las anteriores');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'B', 0, 'PostgreSQL');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'C', 1, 'SQLite');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'D', 1, 'MongoDB');

INSERT INTO question(survey_id, description) VALUES(2, 'que paradigma de programacion es invalido?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'A', 2, 'programacion orientada a objetos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'B', 1, 'programacion orientada a aspectos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'C', 1, 'programacion orientada a restricciones');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'D', 0, 'ninguna de las anteriores');

INSERT INTO question(survey_id, description) VALUES(2, 'cual de todos estos no es un lenguaje de programacion');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'A', 0, 'SQL');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'B', 1, 'Lua');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'C', 1, 'Zig');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'D', 2, 'Python');

INSERT INTO question(survey_id, description) VALUES(2, 'cual de estos lenguajes tiene el mejor manejo de la memoria');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'A', 1, 'rust');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'B', 0, 'C');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'C', 2, 'Java');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'D', 2, 'Javascript');
