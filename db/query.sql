SELECT departments.department_name AS department, roles.title
FROM roles
JOIN departments
ON roles.department_id = departments.id
ORDER BY departments.department_name;

SELECT 
employees.id,
employees.first_name AS First,
employees.last_name AS Last,
roles.title AS Title,
departments.department_name AS Department, 
roles.salary AS Salary,
employees.manager_id AS Manager
FROM departments
JOIN roles 
ON departments.id = roles.department_id
JOIN employees 
ON roles.id = employees.role_id
ORDER BY employees.id;

SELECT e.ID, 
e.first_name AS First, 
e.last_name AS Last,
CONCAT(m.first_name, " ", m.last_name) AS Manager
FROM employees e INNER JOIN employees m
ON m.ID = e.manager_id ORDER BY e.ID;