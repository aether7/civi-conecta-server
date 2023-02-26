INSERT INTO public.user(name, email, password, encrypted_password, active, role)
    VALUES('Mrs. Ashley Aguilar', 'ashley.aguilar@mailinator.com', 'ashley.aguilar', False, True, 'User');

INSERT INTO public.establishment(name, active) VALUES('st peter', True);

INSERT INTO public.course(letter_id, establishment_id, grade_id, teacher_id) VALUES(3, 1, 7, 3);

INSERT INTO public.student(name, run) VALUES ('Rachel Booker', '32514884-5'), ('Daniel Parker', '55421583-1'), ('Vickie Sullivan', '24096613-1'), ('Lauren Arellano', '79077443-4'), ('Alexandra Herrera', '16455017-6');

INSERT INTO public.course_student(course_id, student_id) VALUES (1, 1),(1, 2),(1, 3),(1, 4),(1, 5);
