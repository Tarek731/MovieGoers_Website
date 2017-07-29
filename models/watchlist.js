module.exports = function(sequelize, DataTypes) {
	var Watchlist = sequelize.define('watchlist', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		release_date: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		movieId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		poster: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		overview: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		vote_average: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		popularity: {
			type: DataTypes.INTEGER,
			allowNull: true,
		}
	});

	// set association to movies in watchlist by user
	Watchlist.associate = function(models) {
		Watchlist.belongsTo(models.user, {
			foreignKey: {
				allowNull: false
			}
		});
	}
	return Watchlist; 
}