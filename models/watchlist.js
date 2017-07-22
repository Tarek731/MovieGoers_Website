module.exports = function(sequelize, DataTypes) {

	var Watchlist = sequelize.define('watchlist', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		imdbId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		poster: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	});

	Watchlist.associate = function(models) {
		Watchlist.belongsTo(models.user, {
			foreignKey: {
				allowNull: false
			}
		});
	}

	return Watchlist;
} 

