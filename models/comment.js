module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment', {
      text: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Comment missing'
          }
        }
      },
      publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  );
}
