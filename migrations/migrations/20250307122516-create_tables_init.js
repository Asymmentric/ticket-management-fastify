'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
      async up(queryInterface, Sequelize) {
            // TABLE: status_types
            await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS status_types (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          description VARCHAR(255) )`)

            await queryInterface.bulkInsert('status_types', [{
                  name: "Open",
                  slug: 'open',
                  description: 'Ticket is Open',

            },
            {
                  name: "In Progress",
                  slug: 'in_progress',
                  description: 'Ticket is In Progress',

            },
            {
                  name: "Resolved",
                  slug: 'resolved',
                  description: 'Ticket is Resolved',

            },
            {
                  name: "Closed",
                  slug: 'closed',
                  description: 'Ticket is Closed',

            }
            ])

            // TABLE: priority_types
            await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS priority_types (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          description VARCHAR(255) )`)

            await queryInterface.bulkInsert('priority_types', [{
                  name: 'Low',
                  slug: 'low',
                  description: 'Low Priority',

            },
            {
                  name: 'Medium',
                  slug: 'medium',
                  description: 'Medium Priority',

            },
            {
                  name: 'High',
                  slug: 'high',
                  description: 'High Priority',

            }, {
                  name: 'Urgent',
                  slug: 'urgent',
                  description: 'Urgent Priority',

            }
            ])

            // TABLE: tickets
            await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS agents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now(),
          deleted_at TIMESTAMP 
          )`)

            // TABLE: agents
            await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS tickets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          status_id INT NOT NULL REFERENCES status_types(id) ON DELETE RESTRICT,
          priority_id INT NOT NULL REFERENCES priority_types(id) ON DELETE RESTRICT,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now(),
          deleted_at TIMESTAMP,
          assigned_to UUID REFERENCES agents(id))`)
      },

      async down(queryInterface, Sequelize) {
            // DROP TABLES
            await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS tickets`)
            await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS agents`)
            await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS status_types`)
            await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS priority_types`)
      }
};