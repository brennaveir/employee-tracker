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
                    'Add an employee', 'Update an employee role', 'Quit'
                ]
            }
        ])
        .then((data) => {
            selection(data)
        })

}

function selection(data) {
    switch (data.action) {
        case 'View all departments':
            viewDepartments();
            break;
        case "View all roles":
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees()
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateRole();
            break;
    }
}

function viewDepartments() {
    connection.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        init();
    })
}

function viewRoles() {
    connection.query('SELECT departments.id, roles.title, departments.department_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY departments.id;', function (err, results) {
        console.table(results);
        init();
    })
}

function viewEmployees() {
    connection.query('SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.department_name AS Department, roles.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM departments JOIN roles ON departments.id = roles.department_id JOIN employees ON roles.id = employees.role_id LEFT OUTER JOIN employees m ON m.ID = employees.manager_id ORDER BY employees.id;', function (err, results) {
        console.table(results);
        init();
    })
}

function addDepartment() {
    console.log("Add department!");
    init();
}

function addRole() {
    console.log("Add role!");
    init();
}

function addEmployee() {
    console.log("Add an employee");
    init();
}

function updateRole() {
    console.log("Update role!")
    init();
}

init()