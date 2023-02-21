const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password
        password: 'H#raB3ra!',
        database: 'tracker_db',
    },
    console.log(`Connected to the books_db database.`)
);
//WHEN I start the application THEN I am presented with the following options: 
//view all departments, view all roles, view all employees, add a department, add a role, 
//add an employee, and update an employee role

function viewDepartments() {
    connection.query('SELECT * FROM departments', function(err, results) {
        console.table(results)
    })
}


function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments', 'View all roles',
                    'View all employees', 'Add a department', 'Add a role',
                    'Add an employee', 'Update an employee role'
                ]
            }
        ])
        .then((action) => {
            console.log(action)
            if (action = 'View all departments') {
                viewDepartments()
            }
            else if (action = "View all roles") {
                console.log(roles)
                return
            }
            else {
                console.log("Nope")
            }
        })
        return
}

init()