const inquirer = require('inquirer');
const fs = require('fs/promises');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: 'H#raB3ra!',
      database: 'tracker_db'
    },
    console.log(`Connected to the books_db database.`)
  );

function run() {
    return inquirer
        .prompt([
            {
//WHEN I start the application THEN I am presented with the following options: 
//view all departments, view all roles, view all employees, add a department, add a role, 
//add an employee, and update an employee role
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments', 'View all roles',
                    'View all employees', 'Add a department', 'Add a role',
                    'Add an employee', 'Update an employee role'
                ]
            },
        ])
}

run()