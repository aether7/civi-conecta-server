class ProfileRepository {
  constructor(connection) {
    this.connection = connection;
  }

  getCurrentPlanning(teacherUUID) {
    return this.connection
      .select()
      .from('public.user')
      .where('uuid', teacherUUID)
      .first();
  }

  async updateCurrentPlanning(teacherUUID) {
    const currentPlanning = await this.getCurrentPlanning(teacherUUID);
    const currentPlanificationStatus = Number.parseInt(currentPlanning.is_custom_planification);

    const [row] = await this.connection('public.user')
      .where('uuid', teacherUUID)
      .update({
        is_custom_planification: (currentPlanificationStatus + 1) % 2
      }, ['*']);

    return row;
  }
}

module.exports = ProfileRepository;
