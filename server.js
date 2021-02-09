const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'password',
    database: 'midEarthInk_db',
});

const viewAllEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, department.name AS department, concat(m.first_name, ' ', m.last_name) AS manager FROM employee e JOIN employee m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};

const test2 = () => {
    connection.query("SELECT * ", (err, res) => {
        if (err) throw err;
        console.table(allEmployees);
        allEmployees();
        connection.end();
    })
}



connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    test();
});