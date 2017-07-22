module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [6]
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		status: {
			type: DataTypes.ENUM('active', 'inactive'),
			defaultValue: 'active'
		}
	});

  User.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    User.hasMany(models.Watchlist, {
      onDelete: "cascade"
    });
  };

	return User;
}