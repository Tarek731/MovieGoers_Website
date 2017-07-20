module.exports = function(sequelize, DataTypes) {
	var WatchList = sequelize.define('watchlist', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		imdbID: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		poster: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		classMethods: {
			associate: function(models) {
				WatchList.belongsTo(models.user, {
					foreignKey: {
						allowNull: false
					}
				});
			}
		}
	});
	return WatchList;
} 