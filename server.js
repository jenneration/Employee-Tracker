const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { restoreDefaultPrompts } = require("inquirer");


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


//INITIALIZE APP

const startTracker = () => {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a New Department",
            "Add a New Role",
            "Delete an Existing Department"
        ],
    }).then((answer) => {
        switch (answer.action) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add a New Role":
                addNewRole();
                break;
            default:
                console.log(`Invalid action ${answer.action}`);
        };
    });
};


//****************VIEWS*************************
//View All Departments
//TODO: Add all department budgets
const viewAllDepartments = () => {
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });

}

// View All Roles: Compile-show ids, titles, salaries and associated departments
const viewAllRoles = () => {
    connection.query("SELECT r.id, r.title, r.salary, department.name AS department FROM roles AS r INNER JOIN department ON r.dept_id  = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });
};

// View All Employees
const viewAllEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, department.name AS department, concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id", (err, res) => {
        if (err) throw err;
        //Display results
        console.table(res);
        startTracker();
    });
};


//****************FILTERED VIEWS*************************








//****************ADDITIONS*************************

//TODO: DISPLAY ALL DEPARTMENTS: Compile-show department ids, names, and employee-combined budgets.
//const viewAllDepartments

//Add New Department
const addNewDepartment = () => {
    inquirer.prompt({
        name: "newDept",
        type: "input",
        message: "What DEPARTMENT would you like to add?"
    }).then((answer) => {
        connection.query("INSERT INTO department SET ?", { name: answer.newDept }, (err, res) => {
            if (err) throw err;
            console.log(`${ answer.newDept } HAS BEEN ADDED TO YOUR COMPANY DEPARTMENTS.`);
            addNewDepartment();
            startTracker();
        })
    })
};

//Add New Role
const addNewRole = () => {

    const choiceArray = [];
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;

        inquirer.prompt([{
                    name: "roleTitle",
                    type: "input",
                    message: "What is the TITLE for the New Role: ",
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "Enter a valid SALARY for the New Role (between 20K and 250K): ",
                    validate(value) {
                        if (isNaN(value) === false || value > 20000 || value < 250000) {
                            return true;
                        }
                        console.log("Please enter a valid salary")
                        return false;
                    }
                },
                {
                    name: "choice",
                    type: "list",
                    choices() {
                        //const choiceArray = [];
                        res.forEach(({ id: id, name: name }) => {
                            choiceArray.push({ id, name });
                        });
                        //console.log(choiceArray); //TEST
                        return choiceArray;
                    },
                    message: "What is the DEPARTMENT for this role?"
                }

            ])
            .then((answer) => {
                // console.log(answer.choice);
                console.log(choiceArray);
                let deptID;
                for (i = 0; i < choiceArray.length; i++) {
                    if (answer.choice == choiceArray[i].name) {
                        deptID = choiceArray[i].id;
                    }
                }
                //console.log(`This is deptID ${deptID}`);//TEST

                connection.query("INSERT INTO roles SET ?", {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        dept_id: deptID
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${answer.roleTitle} HAS BEEN ADDED TO COMPANY ROLES.`);
                        startTracker();
                    });

            });
    });
}



//****************DELETIONS*************************

const deleteDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices() {
                    const choiceArray = [];
                    res.forEach(({ name }) => {
                        choiceArray.push(name);
                    });
                    return choiceArray;
                },
                message: "Which DEPARTMENT will you DELETE?",
            }])
            .then((answer) => {
                console.log(answer);
                // if (department.name === answer.choice) {
                connection.query("DELETE FROM department WHERE ?", { name: answer.choice }, (err, res) => {
                    if (err) throw err;
                    console.log(`${ answer.choice } HAS BEEN DELETED FROM YOUR COMPANY DEPARTMENTS.`);
                    //deleteDepartment();
                    startTracker();

                });
            });
    });

}





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
    startTracker();
});