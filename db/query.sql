SELECT 
departments.id,
roles.title,
departments.department_name AS department, 
roles.salary
FROM roles
JOIN departments
ON roles.department_id = departments.id
ORDER BY departments.id;


SELECT 
employees.id,
employees.first_name AS First,
employees.last_name AS Last,
roles.title AS Title,
departments.department_name AS Department, 
roles.salary AS Salary,
CONCAT(m.first_name, " ", m.last_name) AS Manager
FROM departments
JOIN roles 
ON departments.id = roles.department_id
JOIN employees 
ON roles.id = employees.role_id
LEFT OUTER JOIN employees m
ON m.ID = employees.manager_id 
ORDER BY employees.id;


SELECT e.ID, 
e.first_name AS First, 
e.last_name AS Last,
CONCAT(m.first_name, " ", m.last_name) AS Manager
FROM employees e 
LEFT OUTER JOIN employees m
ON m.ID = e.manager_id ORDER BY e.ID;

