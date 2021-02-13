const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    //MySQL password and targeted DB
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
            "View Employee By Manager",
            "Add New Department",
            "Add New Role",
            "Add New Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Delete a Department",
            "Delete a Role",
            "Delete an Employee"
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
            case "View Employee By Manager":
                viewEmpByManager();
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
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Delete a Department":
                deleteDepartment();
                break;
            case "Delete a Role":
                deleteRole();
                break;
            case "Delete an Employee":
                deleteEmployee();
                break;
            default:
                console.log(`Invalid action ${answer.action}`);
        };
    });
};


//****************READ*************************
//View All Department: name and id
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


//View Employees by Manager








//****************CREATE*************************

//Add New Department
const addNewDepartment = () => {
    inquirer.prompt({
        name: "newDept",
        type: "input",
        message: "What department would you like to add?"
    }).then((answer) => {
        connection.query("INSERT INTO department SET ?", { name: answer.newDept }, (err, res) => {
            if (err) throw err;
            console.log(`**"${ answer.newDept }" Successfully added to Departments**`);
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
                    message: "What is the salary for the New Role: ",
                    //TODO: Fix validation
                    validate(value) {
                        if (isNaN(value) === false && (value) > 20000 && value < 250000) {
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
                        res.forEach(({ name }) => {
                            deptArray.push(name);
                        });
                        return deptArray;
                    },
                    message: "Select the Department for this role: "
                }

            ])
            .then((answer) => {
                //console.log("In answers " + deptArray); //TEST
                let deptID;
                res.filter((dept) => {
                    if (dept.name === answer.choice) {
                        //console.log(newRole.id)
                        return deptID = dept.id;
                    };
                });
                connection.query("INSERT INTO roles SET ?", {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        dept_id: deptID
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`**"${answer.roleTitle}"** Successfully added to company Roles`);
                        startTracker();
                    });
            });
    });
};

//Add New Employee with role and mgr. ids
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

//****************UPDATE*************************
//Update Employee Role
const updateEmployeeRole = () => {
    //Get employee for query 
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
                //****REFACTOR THIS ?
                res.filter((emp) => {
                    if (emp.first_name + " " + emp.last_name === answer.employee) {
                        console.log(emp.id)
                        return empID = emp.id;
                    };
                });
                //Get roles for query
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
                                    //console.log(res);
                                    return roleArray;
                                },
                                message: "What is their new role?"
                            }]).then((answer) => {
                                let roleID;
                                res.filter((newRole) => {
                                    if (newRole.title === answer.role) {
                                        //console.log(newRole.id)
                                        return roleID = newRole.id;
                                    };
                                });
                                //Update MySql DB
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

//Update Employee Manager
const updateEmployeeManager = () => {
    //Get employee for query 
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
                    return empArray;
                },
                message: "Which employee will you update?"
            }, ]).then((answer) => {
                let employee = answer.employee;
                let empID;
                //****Can i make this way shorter?
                res.filter((emp) => {
                    if (emp.first_name + " " + emp.last_name === answer.employee) {
                        console.log(emp.id)
                        return empID = emp.id;
                    };
                });
                //Get employees for manager query
                if (answer.employee != "") {
                    connection.query("SELECT * FROM employee", (err, res) => {
                        if (err) throw err;
                        inquirer
                            .prompt([{
                                name: "manager",
                                type: "list",
                                choices() {
                                    let mgrArray = [];
                                    res.forEach(({ first_name, last_name }) => {
                                        mgrArray.push(first_name + " " + last_name);
                                    });
                                    //console.log(res);
                                    return mgrArray;
                                },
                                message: "Select employee's new manager: "
                            }]).then((answer) => {
                                let mgrID;
                                res.filter((newMgr) => {
                                    if (newMgr.title === answer.manager) {
                                        //console.log(newRole.id)
                                        return mgrID = newMgr.id;
                                    };
                                });
                                //Update MySql DB
                                connection.query("UPDATE employee SET ? WHERE ?", [{
                                        manager_id: mgrID,
                                    },
                                    {
                                        id: empID,
                                    }
                                ], (err, res) => {
                                    if (err) throw err;
                                    console.log(`${employee}'s manager has been changed to ${answer.manager}`)
                                })
                            })
                    })
                }

            });
    });
};










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
                    const deptArray = [];
                    res.forEach(({ id, name }) => {
                        deptArray.push(`#${id} ${name}`);
                    });
                    return deptArray;
                },
                message: "Which department will you delete?",
            }])
            .then((answer) => {
                let deptID;
                for (i = 0; i < deptArray.length; i++) {
                    if (answer.choice === deptArray[i].name) {
                        deptID = deptArray[i].id;
                    }
                    //console.log("dept ID " + deptID)
                };
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