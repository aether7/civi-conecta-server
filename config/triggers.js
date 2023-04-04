const development = {
  triggerUpdatedAt: (tableName) => {
    return `
      CREATE TRIGGER ${tableName}_updated_at
      AFTER UPDATE ON ${tableName}
      BEGIN
        UPDATE ${tableName} SET updated_at = (SELECT datetime()) WHERE id = NEW.id;
      END;
    `;
  }
};

const other = {};

module.exports = {
  development,
  other
};
