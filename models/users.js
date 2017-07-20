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
	},
	{
		classMethods: {
			associate: function(models) {
				User.hasMany(models.watchList, {
					onDelete: 'cascade'
				});
			}
		}
	});
	return User;
} 