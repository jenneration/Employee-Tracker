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
            "Add New Department",
            "Add New Role",
            "Add New Employee",
            "Update Employee Role",
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
            case "Add New Department":
                addNewDepartment();
                break;
            case "Add New Role":
                addNewRole();
                break;
            case "Add New Employee":
                addNewEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            default:
                console.log(`Invalid action ${answer.action}`);
        };
    });
};


//****************READ*************************
//View All Departments
//TODO: Add all department budgets
const viewAllDepartments = () => {
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });

}

// View All Roles: show id, title, salary, associated department
const viewAllRoles = () => {
    connection.query("SELECT r.id, r.title, r.salary, department.name AS department FROM roles AS r INNER JOIN department ON r.dept_id  = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });
};

// View All Employees: id, name, role, salary, manager, dept
const viewAllEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, department.name AS department, concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id", (err, res) => {
        if (err) throw err;
        //Display results
        console.table(res);
        startTracker();
    });
};

//****************CREATE*************************

//TODO: DISPLAY ALL DEPARTMENTS: id, name, and **employee-combined budgets.
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

//Add New Role with dept. id
const addNewRole = () => {
    const deptArray = [];
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
                    //TODO: Fix validation
                    validate(value) {
                        if (isNaN(value) === false || (value) > 20000 || value < 250000) {
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
                        //References deptArray at start of function
                        res.forEach(({ id, name }) => {
                            deptArray.push({ id, name });
                        });
                        console.log("Inside choices " + deptArray); //TEST
                        return deptArray;
                    },
                    message: "What is the DEPARTMENT for this role?"
                }

            ])
            .then((answer) => {
                console.log("In answers " + deptArray); //TEST
                let deptID;
                for (i = 0; i < deptArray.length; i++) {
                    if (answer.choice === deptArray[i].name) {
                        deptID = deptArray[i].id;
                    }
                    //console.log("dept ID " + deptID)
                };
                connection.query("INSERT INTO roles SET ?", {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        dept_id: deptID
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${answer.roleTitle} HAS BEEN ADDED TO COMPANY ROLES`);
                        startTracker();
                    });
            });
    });
};

//Add New Employee with role & mgr. id
const addNewEmployee = () => {
    const roleQuery = "SELECT * FROM roles";
    const mgrQuery = "SELECT * FROM employee"
    connection.query(roleQuery, (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
                    name: "empFirstName",
                    type: "input",
                    message: "Please enter new employee FIRST NAME: ",
                },
                {
                    name: "empLastName",
                    type: "input",
                    message: "Enter new employee LAST NAME: ",
                },
                {
                    name: "choice",
                    type: "list",
                    choices() {
                        let rolesArray = []; //to hold titles for choices display options
                        res.forEach(({ id, title }) => {
                            rolesArray.push(title);
                        });
                        console.log("This is in roleQuery " + rolesArray); //TEST
                        return rolesArray;
                    },
                    message: "Select new employees's ROLE: "
                },
            ])
            .then((answer) => {
                //console.log(answer);
                const firstName = answer.empFirstName;
                console.log(firstName);
                const lastName = answer.empLastName;

                let roleID;
                res.filter((role) => {
                    if (role.title === answer.choice) {
                        console.log(role.id);
                        return roleID = role.id;
                    };
                });

                if (answer.choice != "") {
                    connection.query(mgrQuery, (err, res) => {
                        if (err) throw err;
                        connection.query(mgrQuery, (err, res) => {
                            if (err) throw err;
                            inquirer.prompt([{
                                name: "choice2",
                                type: "list",
                                choices() {
                                    let mgrArray = ["Not Applicable"];
                                    res.forEach(({ id, first_name, last_name }) => {
                                        mgrArray.push(first_name + " " + last_name);
                                    });
                                    return mgrArray;
                                },
                                message: "Select the new employee's MANAGER: "
                            }]).then((answer) => {
                                //console.log(answer.choice2)
                                let mgrID;
                                res.filter((mgr) => {
                                    if (mgr.first_name + " " + mgr.last_name === answer.choice2) {
                                        console.log(mgr.id);
                                        return mgrID = mgr.id;
                                    } else if (answer.choice2 === "Not Applicable") {
                                        return mgrID = "null";
                                    };

                                });
                                connection.query("INSERT INTO employee SET ?", {
                                    first_name: firstName,
                                    last_name: lastName,
                                    role_id: roleID,
                                    manager_id: mgrID
                                }, (err, res) => {
                                    if (err) throw err;
                                    console.log(`${firstName} ${lastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
                                    startTracker();
                                })

                            });
                        });

                    });
                };

            });
    });
};

// //****************UPDATE*************************

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee",
                type: "list",
                choices() {
                    let empArray = [];
                    res.forEach(({ first_name, last_name }) => {
                        empArray.push(first_name + " " + last_name);
                    });
                    console.log(empArray);
                    return empArray;
                },
                message: "Which employee will you update?"
            }, ]).then((answer) => {
                let employee = answer.employee;
                let empID;
                res.filter((emp) => {
                    if (emp.first_name + " " + emp.last_name === answer.employee) {
                        console.log(emp.id)
                        return empID = emp.id;
                    };
                });
                ////////////////////////////
                if (answer.employee != "") {
                    connection.query("SELECT * FROM roles", (err, res) => {
                        if (err) throw err;
                        inquirer
                            .prompt([{
                                name: "role",
                                type: "list",
                                choices() {
                                    let roleArray = [];
                                    res.forEach(({ title }) => {
                                        roleArray.push(title);
                                    });
                                    console.log(res);
                                    return roleArray;
                                },
                                message: "What is their new role?"
                            }]).then((answer) => {
                                console.log(res)
                                let roleID;
                                res.filter((newRole) => {
                                    if (newRole.title === answer.role) {
                                        console.log(newRole.id)
                                        return roleID = newRole.id;
                                    };
                                });
                                connection.query("UPDATE employee SET ? WHERE ?", [{
                                        role_id: roleID,
                                    },
                                    {
                                        id: empID,
                                    }
                                ], (err, res) => {
                                    if (err) throw err;
                                    console.log(`${employee}'s role has been changed to ${answer.role}`)
                                })
                            })
                    })
                }

            });
    });
};




//"SELECT CONCAT(m.lastName, ', ', m.firstName) FROM employee e INNER JOIN employee m ON e.manager_id = m.id"







// //****************DELETE*************************
//TODO: Double check
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
                console.log(answer); //TEST
                connection.query("DELETE FROM department WHERE ?", { name: answer.choice }, (err, res) => {
                    if (err) throw err;
                    console.log(`${ answer.choice } HAS BEEN DELETED FROM YOUR COMPANY DEPARTMENTS.`);
                    startTracker();

                });
            });
    });

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
    startTracker();
});