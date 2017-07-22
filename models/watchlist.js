module.exports = function(sequelize, DataTypes) {
  var Watchlist = sequelize.define("Watchlist", {
    movie_id: {
      type: DataTypes.INTEGER
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    watchlist: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      
    }
  });

  Watchlist.associate = function(models) {
    // We're saying that a Watchlist should belong to an User
    // A Watchlist can't be created without an User due to the foreign key constraint
    Watchlist.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Watchlist;
};