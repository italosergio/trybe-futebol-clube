'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      home_team: { type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id'
      } },
      home_team_goals: { type: Sequelize.INTEGER },
      away_team: { type: Sequelize.INTEGER },
      away_team_goals: { type: Sequelize.INTEGER },
      in_progress: { type: Sequelize.INTEGER },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('matches');
  },
};
