INSERT INTO user(name, email, password, encrypted_password, active, role, uuid) VALUES('Mrs. Ashley Aguilar', 'ashley.aguilar@mailinator.com', 'ashley.aguilar', 0, 1, 'User', '455fd91d-15ac-48b6-8b2a-e75d7891bbab');

INSERT INTO establishment(name, active) VALUES('st peter', 1);

INSERT INTO course(letter_id, establishment_id, grade_id, teacher_id) VALUES(3, 1, 7, 3);

INSERT INTO student(name, run, uuid) VALUES
    ('Rachel Booker', '32514884-5', 'af2ef79e-d86c-49d2-a426-3beaa380fe38'),
    ('Daniel Parker', '55421583-1', '722ebf37-c9d2-4137-8a0e-6caeeaa5841d'),
    ('Vickie Sullivan', '24096613-1', '77a06d10-2daf-4d60-9bbe-d116807f4d42'),
    ('Lauren Arellano', '79077443-4', '6d065a40-7b19-413f-b4bc-e28b9aaa7b4a'),
    ('Alexandra Herrera', '16455017-6', 'd7bd8582-9034-4ea2-b65e-53e314407797');

INSERT INTO course_student(course_id, student_id) VALUES (1, 1),(1, 2),(1, 3),(1, 4),(1, 5);

-- encuesta para profesor
INSERT INTO topic(title, number) VALUES ('conocimiento programacion', 1);

INSERT INTO question(topic_id, description) VALUES(1, 'con que lenguaje se desarrollo esta aplicacion?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'A', 1, 'Node JS');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'B', 2, 'Java');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'C', 0, 'Javascript');
INSERT INTO alternative(question_id, letter, value, description) VALUES(1, 'D', 1, 'React');

INSERT INTO question(topic_id, description) VALUES(1, 'que paradigma de programacion es invalido?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'A', 2, 'programacion orientada a objetos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'B', 1, 'programacion orientada a aspectos');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'C', 1, 'programacion orientada a restricciones');
INSERT INTO alternative(question_id, letter, value, description) VALUES(2, 'D', 0, 'ninguna de las anteriores');

INSERT INTO topic(title, number) VALUES ('Base de datos', 2);

INSERT INTO question(topic_id, description) VALUES(2, 'que base de datos se esta utilizando?');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'A', 2, 'ninguna de las anteriores');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'B', 0, 'PostgreSQL');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'C', 1, 'SQLite');
INSERT INTO alternative(question_id, letter, value, description) VALUES(3, 'D', 1, 'MongoDB');

INSERT INTO question(topic_id, description) VALUES(2, 'cual de todas estas no es una DB');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'A', 1, 'CockroachDB');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'B', 0, 'AlligatorDB');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'C', 2, 'Apache Cassandra');
INSERT INTO alternative(question_id, letter, value, description) VALUES(4, 'D', 1, 'DuckDB');

INSERT INTO topic(title, number) VALUES ('GIT', 3);

INSERT INTO question(topic_id, description) VALUES(3, 'que comando se usa para ingresar cambios al staging area');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'A', 1, 'git commit');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'B', 2, 'git save');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'C', 1, 'git push');
INSERT INTO alternative(question_id, letter, value, description) VALUES(5, 'D', 0, 'git add');

INSERT INTO question(topic_id, description) VALUES(3, 'que comando nos ayuda a descubrir el commit que metio un bug en el historial');
INSERT INTO alternative(question_id, letter, value, description) VALUES(6, 'A', 2, 'git reflog');
INSERT INTO alternative(question_id, letter, value, description) VALUES(6, 'B', 1, 'git reset');
INSERT INTO alternative(question_id, letter, value, description) VALUES(6, 'C', 0, 'git bisect');
INSERT INTO alternative(question_id, letter, value, description) VALUES(6, 'D', 1, 'git checkout');

INSERT INTO topic(title, number) VALUES ('variados', 4);

INSERT INTO question(topic_id, description) VALUES(4, 'que sistema operativo es mejor para el gaming');
INSERT INTO alternative(question_id, letter, value, description) VALUES(7, 'A', 1, 'Linux');
INSERT INTO alternative(question_id, letter, value, description) VALUES(7, 'B', 0, 'Windows');
INSERT INTO alternative(question_id, letter, value, description) VALUES(7, 'C', 1, 'MacOS');
INSERT INTO alternative(question_id, letter, value, description) VALUES(7, 'D', 2, 'PlayStation');

INSERT INTO question(topic_id, description) VALUES(4, 'que prefiere ud, el tangananica o el tangananá');
INSERT INTO alternative(question_id, letter, value, description) VALUES(8, 'A', 0, 'a mi me gusta el tangananica');
INSERT INTO alternative(question_id, letter, value, description) VALUES(8, 'B', 1, 'yo prefiero el tangananá');
INSERT INTO alternative(question_id, letter, value, description) VALUES(8, 'C', 2, 'la mejor historia es tangananica');
INSERT INTO alternative(question_id, letter, value, description) VALUES(8, 'D', 1, 'el mejor verso es tangananá');


-- encuesta para alumno
INSERT INTO topic(title, number) VALUES ('conocimiento pokemon', 1);

INSERT INTO question(topic_id, is_for_student, description) VALUES(5, 1, 'con cual pokemon es mas dificil comenzar');
INSERT INTO alternative(question_id, letter, value, description) VALUES(9, 'A', 1, 'bulbasaur');
INSERT INTO alternative(question_id, letter, value, description) VALUES(9, 'B', 0, 'charmander');
INSERT INTO alternative(question_id, letter, value, description) VALUES(9, 'C', 1, 'squartle');
INSERT INTO alternative(question_id, letter, value, description) VALUES(9, 'D', 2, 'ninguna de las anteriores');

INSERT INTO question(topic_id, is_for_student, description) VALUES(5, 1, 'cual es la generacion de slaking');
INSERT INTO alternative(question_id, letter, value, description) VALUES(10, 'A', 2, 'primera generacion');
INSERT INTO alternative(question_id, letter, value, description) VALUES(10, 'B', 1, 'segunda generacion');
INSERT INTO alternative(question_id, letter, value, description) VALUES(10, 'C', 0, 'tercera generacion');
INSERT INTO alternative(question_id, letter, value, description) VALUES(10, 'D', 1, 'ninguna de las anteriores');


-- TEMAS DE UNIDADES
INSERT INTO unit(number, title, description, grade_id, topic_id) VALUES(1, 'unidad 01', 'descripcion unidad 1', 7, 1);
INSERT INTO lesson(number, objective, description, unit_id) VALUES(1, 'probar el tema de los archivos', 'no darse la mansa vuelta para el tema de los archivos', 1);

INSERT INTO planning(
    topic,
    keywords,
    start_activity,
    main_activity,
    end_activity,
    teacher_material,
    student_material,
    lesson_id
) VALUES (
    'tema para colocar en clase',
    'tanjiro,nezuko,muzan,alakazam',
    'inicio de actividad ftw',
    'actividad principal de la vida',
    'actividad de cierre por si acaso',
    'gafas,celular,cuaderno',
    'cuaderno,estuche,cartulina',
    1
);

-- situaciones emergentes 4 situaciones emergentes
INSERT INTO event(title, description, event_type_id, grade_id) VALUES('situacion emergente 01', 'lorem ipsum', 1, 7);
INSERT INTO event(title, description, event_type_id, grade_id) VALUES('situacion emergente 02', 'lorem ipsum', 1, 7);
INSERT INTO event(title, description, event_type_id, grade_id) VALUES('situacion emergente 03', 'lorem ipsum', 1, 7);
INSERT INTO event(title, description, event_type_id, grade_id) VALUES('situacion emergente 04', 'lorem ipsum', 1, 7);

-- efemerides 6 efemerides
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('dia del trabajo', 'dia del trabajo','05-01',2, 7);
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('18 de septiembre', '18 de septiembre','09-18',2, 7);
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('navidad', 'navidad','12-25',2, 7);
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('año nuevo', 'año nuevo','12-31',2, 7);
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('dia del virgen de lo vasquez', 'dia del virgen de lo vasquez','12-08',2, 7);
INSERT INTO event(title, description, date, event_type_id, grade_id) VALUES('combate naval de iquique glorioso', 'combate naval de iquique glorioso','05-21',2, 7);

-- 2 lecciones para 2 temas
INSERT INTO lesson(number, description, event_id) VALUES(1, 'descripcion para la situacion emergente 01 bla bla bla', 1);
INSERT INTO lesson(number, description, event_id) VALUES(1, 'hablar del 18 septiembre y los terremotos y las empanadas', 6);

INSERT INTO planning(topic, keywords, start_activity, main_activity, end_activity, teacher_material, student_material, lesson_id) VALUES('tema a tratar','actividad,dummy,test','actividad de inicio','actividad principal','termino actividad','material01,material02','material1,material2', 2);
INSERT INTO planning(topic, keywords, start_activity, main_activity, end_activity, teacher_material, student_material, lesson_id) VALUES('iniciar actividades del 18 de septiembre','18 sept,fiestas patrias,uyuuui','preparar las cosas','dar comienzo al 18','celebrar el 18 eaea','anticucho,cola de mono','chicha,terremoto,empanada', 3);
