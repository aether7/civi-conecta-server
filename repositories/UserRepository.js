const uuid = require('uuid');
const { EntityNotFoundError } = require('./exceptions');
const passwordHelper = require('../helpers/password');
const { RoleTypes } = require('../constants/entities');

class UserRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreateUser({ name, email }) {
    try {
      const entity = await this.findOneByEmail(email);
      return entity;
    } catch (err) {
      const password = await passwordHelper.createRandomPassword();
      const entity = await this.createUser({ name, email, password });
      return entity;
    }
  }

  async findOneByEmail(email) {
    const entity = await this.connection
      .column({
        id: 'public.user.id',
        name: 'public.user.name',
        email: 'public.user.email',
        role: 'public.user.role',
        password: 'public.user.password',
        user_active: 'public.user.active',
        user_uuid: 'public.user.uuid',
        encrypted_password: 'public.user.encrypted_password',
        is_custom_planification: 'public.user.is_custom_planification',
        is_establishment_active: 'establishment.active'
      })
      .from('public.user')
      .leftJoin('course', 'course.teacher_id', 'public.user.id')
      .leftJoin('establishment', 'course.establishment_id', 'establishment.id')
      .where('public.user.email', email)
      .where('public.user.active', 1)
      .first();

    if (!entity) {
      throw new EntityNotFoundError(`No existe el usuario activo con el correo ${email}`);
    }

    return entity;
  }

  async createAdmin({ email, name, password }) {
    const fields = {
      uuid: uuid.v4(),
      email,
      name,
      password: passwordHelper.encrypt(password),
      encrypted_password: 1,
      active: 1,
      role: RoleTypes.ADMIN
    };

    const [user] = await this.connection.insert(fields, ['*']).into('user');
    return user;
  }

  async createUser({ email, name, password }) {
    const fields = {
      uuid: uuid.v4(),
      email,
      name,
      password,
      encrypted_password: 0,
      active: 1,
      role: RoleTypes.USER
    };

    const [user] = await this.connection.insert(fields, ['*']).into('user');
    return user;
  }

  async updatePassword(userId, password) {
    const fields = {
      encrypted_password: 1,
      updated_at: new Date(),
      password: passwordHelper.encrypt(password)
    };

    return this.connection('user')
      .where('id', userId)
      .update(fields);
  }

  findByAlias(uuid) {
    return this.connection
      .select()
      .from('user')
      .where('uuid', uuid)
      .first();
  }

  findByFeedbackCourseUUID(uuid) {
    return this.connection
      .select('user.*')
      .from('user')
      .innerJoin('course', 'user.id', 'course.teacher_id')
      .innerJoin('feedback_course','feedback_course.course_id', 'course.id')
      .where('feedback_course.uuid', uuid)
      .first();
  }

  updateCustomPlanification(id) {
    return this.connection('user')
      .where('id', id)
      .update('is_custom_planification', 1);
  }
}

module.exports = UserRepository;
