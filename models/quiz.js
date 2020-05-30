module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz', {
      question: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Missing question'
          }
        }
      },
      answer: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Missing answer'
          }
        }
      },
      image: {
        type: DataTypes.STRING
      },
      mimetype: {
        type: DataTypes.STRING
      },
      thematic: {
        type: DataTypes.STRING
      }
    }
  );
}
