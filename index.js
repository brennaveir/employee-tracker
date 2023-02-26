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
        database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
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
                    'Add an employee', 'Update an employee role'
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
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department you would like to add?'
            }
        ])
        .then((data) => {
            connection.promise().query(`INSERT INTO departments (department_name) VALUES ("${data.department}")`)
                .then((data) => {
                    console.log(`Added department`);
                })
                .catch(console.log)
                .then(() => viewDepartments());
        })
}

function addRole() {
    connection.promise().query('SELECT * FROM departments')
        .then((departmentRows) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'What is the title of the role?'
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: 'What is the salary of the role? (ex. xxxxxx.xx)',
                    },
                    {
                        type: 'list',
                        name: 'roleDepartment',
                        message: 'What is the department of the role?',
                        choices: departmentRows[0].map((row) => {
                            return {
                                name: row.department_name,
                                value: row.id
                            }
                        })
                    }
                ])
                .then((data) => {
                    connection.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.roleTitle}', ${data.roleSalary}, ${data.roleDepartment})`)
                        .then((data) => {
                            console.log(`Added role`);
                        })
                        .catch(console.log)
                        .then(() => viewRoles());
                })
        })
}

function addEmployee() {
    connection.promise().query('SELECT id, title FROM roles')
        .then((rolesRows) => {
            connection.promise().query('SELECT id, first_name, last_name FROM employees')
                .then((employeeRows) => {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'firstName',
                                message: 'What is the first name of the employee?'
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: 'What is the last name of the employee?'
                            },
                            {
                                type: 'list',
                                name: 'employeeManager',
                                message: 'Who is the manager of the employee?',
                                choices: employeeRows[0].map((row) => {
                                    return {
                                        name: `${row.first_name} ${row.last_name}`,
                                        value: row.id
                                    }
                                })
                            },
                            {
                                type: 'list',
                                name: 'employeeRole',
                                message: 'What is the role of the employee?',
                                choices: rolesRows[0].map((row) => {
                                    return {
                                        name: row.title,
                                        value: row.id
                                    }
                                })
                            }
                        ])
                        .then((data) => {
                            connection.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${data.employeeRole}, ${data.employeeManager})`);
                            console.log('Added employee')
                        })
                        .catch(console.log)
                        .then(() => viewEmployees());
                })
        })
}


function updateRole() {
    connection.promise().query(`SELECT id, first_name, last_name FROM employees`)
        .then((employeeRow) => {
            connection.promise().query('SELECT id, title FROM roles')
                .then((rolesRow) => {
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeName',
                                message: 'What is the name of the employee you would like to update?',
                                choices: employeeRow[0].map((row) => {
                                    return {
                                        name: `${row.first_name} ${row.last_name}`,
                                        value: row.id
                                    }
                                })
                            },
                            {
                                type: 'list',
                                name: 'employeeRole',
                                message: 'What is role you would like to assign to this employee?',
                                choices: rolesRow[0].map((row) => {
                                    return {
                                        name: row.title,
                                        value: row.id
                                    }
                                })
                            }
                        ])
                        .then((data) => {
                            connection.promise().query(`UPDATE employees SET role_id = ? WHERE id = ?`, [data.employeeRole, data.employeeName]);
                            console.log('Updated role')
                        })
                        .catch(console.log)
                        .then(() => viewEmployees());
                })
        })

}


init()