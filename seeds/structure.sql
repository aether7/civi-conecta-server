CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT,
    encrypted_password INTEGER DEFAULT 1,
    active INTEGER DEFAULT 1,
    role TEXT,
    created_at TEXT DEFAULT now(),
    updated_at TEXT DEFAULT now()
);

CREATE TABLE grade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT
);

CREATE TABLE letter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character TEXT
);

CREATE TABLE establishment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    active INTEGER DEFAULT 1
);

CREATE TABLE student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    run TEXT UNIQUE
);

CREATE TABLE topic (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER UNIQUE,
    name TEXT,
    grade_id INTEGER,
    FOREIGN KEY(grade_id) REFERENCES grade(id)
);

CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    letter_id INTEGER,
    establishment_id INTEGER,
    grade_id INTEGER,
    teacher_id INTEGER,
    FOREIGN KEY(letter_id) REFERENCES letter(id),
    FOREIGN KEY(establishment_id) REFERENCES establishment(id),
    FOREIGN KEY(grade_id) REFERENCES grade(id),
    FOREIGN KEY(teacher_id) REFERENCES user(id)
);

CREATE TABLE course_students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    student_id INTEGER,
    FOREIGN KEY(course_id) REFERENCES course(id),
    FOREIGN KEY(student_id) REFERENCES student(id)
);

CREATE TABLE unit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER,
    title TEXT,
    description TEXT,
    grade_id INTEGER,
    topic_id INTEGER,
    FOREIGN KEY(grade_id) REFERENCES grade(id),
    FOREIGN KEY(topic_id) REFERENCES topic(id)
);

CREATE TABLE planning (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    keywords TEXT,
    start_activity TEXT,
    main_activity TEXT,
    end_activity TEXT,
    teacher_material TEXT,
    student_material TEXT
);

CREATE TABLE class (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER,
    title TEXT,
    description TEXT,
    objetives TEXT,
    unit_id INTEGER,
    planning_id INTEGER,
    FOREIGN KEY(unit_id) REFERENCES unit(id),
    FOREIGN KEY(planning_id) REFERENCES planning(id);
);

-- pendiente crear relacion encuesta para un grade
CREATE TABLE survey (

);
