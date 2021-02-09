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
    connection.query("SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, department.name AS department, concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id", (err, res) => {
        if (err) throw err;
        //Display results
        console.table(res);
        //TODO: Return to Main Menu options
        connection.end();
    });
};

//DISPLAY ROLES: Compile-show ids, titles, salaries and associated departments
const viewAllRoles = () => {
    connection.query("SELECT r.id, r.title, r.salary, department.name AS department FROM roles AS r INNER JOIN department ON r.dept_id  = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        //TODO: Return to Main Menu options
        connection.end;
    });
};

//TODO: DISPLAY ALL DEPARTMENTS: Compile-show department ids, names, and employee-combined budgets.
//const viewAllDepartments

//ADD NEW DEPARTMENT

// const addNewDepartment = () => {
//     inquirer.prompt({
//         name: "newDept",
//         type: "input",
//         message: "What DEPARTMENT would you like to add?"
//     }).then((answer) => {
//         connection.query("INSERT INTO department SET ?", { name: answer.newDept }, (err, res) => {
//             if (err) throw err;

//             console.log(`\n${ answer.newDept } HAS BEEN ADDED TO YOUR COMPANY DEPARTMENTS.`);
//             addNewDepartment();
//             //TODO: viewAllDepartments() -- to display new entry
//         })
//     })
// };

//TODELETE DEPARTMENT
//TODO create array w/ all depts and give choice
const deleteNewDepartment = () => {
    inquirer.prompt({
        name: "deleteDept",
        type: "input",
        message: "What DEPARTMENT would you like to DELETE?"
    }).then((answer) => {
        connection.query("DELETE FROM department WHERE ?", { name: answer.deleteDept }, (err, res) => {
            if (err) throw err;

            console.log(`\n${ answer.newDept } HAS BEEN ADDED TO YOUR COMPANY DEPARTMENTS.`);
            addNewDepartment();
            //TODO: viewAllDepartments() -- to display new entry
        })
    })
};






//TEST CONNECTION
const test2 = () => {
    connection.query("SELECT * ", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}



connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    addNewDepartment();
});