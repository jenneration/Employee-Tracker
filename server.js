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
            "Add New Department",
            "Add New Role",
            "Add New Employee",
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
                    console.log("dept ID " + deptID)
                }
                //console.log(`This is deptID ${deptID}`);//TEST

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

///*****TEST ADD EMP */
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
                //console.log(res);
                console.log(answer);
                //console.log(roleObj);
                //Grab role ID from answer
                const firstName = answer.empFirstName;
                console.log(firstName);
                const lastName = answer.empLastName;
                console.log(lastName);

                let roleID;
                res.filter((role) => {
                    if (role.title === answer.choice) {
                        console.log(role.id);
                        return roleID = role.id;
                    };
                });
                // for (let i = 0; i < res.length; i++) {
                //     if (res[i].title === answer.choice) {
                //         roleID = res[i].id;
                //     };
                //     console.log("Role id " + roleID); //TEST
                // };

                //////////////////////////PART 2 ///////////////////

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
                                        //mgrArray.push(`${first_name} ${last_name}`);
                                    });
                                    //console.log(mgrArray);
                                    return mgrArray;
                                },
                                message: "Select the new employee's MANAGER: "
                            }]).then((answer) => {
                                //console.log(res);
                                console.log(answer.choice2)
                                let mgrID;
                                res.filter((mgr) => {
                                    if (mgr.first_name + " " + mgr.last_name === answer.choice2) {
                                        console.log(mgr.id);
                                        return mgrID = mgr.id;

                                    } else if (answer.choice2 === "Not Applicable") {
                                        return mgrID = "null";
                                    };
                                    //console.log("THIS IS MGR ID " + mgr.id);//TEST 

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



// console.log(res);
// console.log(answer);
// console.log(roleObj);
// console.log("Under Answers " + rolesArray); //TEST
//let roleID;
//                     for (let i = 0; i < roleObj.length; i++) {
//                         if (answer.choice === roleObj[i].title) {
//                             roleID = roleObj[i].id;
//                         };
//                         console.log("Role id " + roleID); //TEST
//                     };
//     let holder = [];
//     holder.push(answer);
//     console.log(holder);
//     connection.query(mgrQuery, (err, res) => {
//             if (err) throw err;
//             inquirer.prompt([{
//                     name: "choice2",
//                     type: "list",
//                     choices() {
//                         // let mgrArray = []; //to hold titles for choices display options
//                         // let mgrObj = [] //to hold id + titles to grab role.id for sql INSERT
//                         // res.forEach(({ id, first_name, last_name }) => {
//                         //     mgrArray.push(first_name, last_name);
//                         //     mgrObj.push({ id, first_name, last_name });
//                             res.forEach(({ id, m.first_name, m.last_name }) => {
//                                 mgrArray.push(`${first_name} ${last_name}`);
//                                 mgrObj.push({ id, first_name, last_name });
//                         });
//                         console.log("This is in mgrQuery" + mgrArray); //TEST
//                         console.log(mgrObj);
//                         return mgrArray;
//                     },
//                     message: "Select new employee's MANAGER: "
//                 }
//             ]).then((answer) => {
//                     
//                     let mgID;
//                     for (let i = 0; i < roleObj.length; i++) {
//                         if (answer.choice2 === mgrObj[i].first_name) {
//                             mgrID = mgrObj[i].id;
//                         };
//                         console.log("Role id " + roleID); //TEST
//                     };

//                     connection.query("INSERT INTO employee SET ?", {
//                             first_name: answer.empFirstName,
//                             last_name: answer.empLastName,
//                             role_id: roleID,
//                             manager_id: mgrID
//                         },
//                         (err, res) => {
//                             if (err) throw err;
//                             console.log(`${answer.empFirstName} ${answer.empLastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
//                             startTracker();
//                 });
//             }


/////////////////////////////////////////////////////////////////////




//TODO: ADD MANAGER ID TO NEW EMPLOYEE
// connection.query("SELECT e.id, concat(m.first_name, ' ', m.last_name) FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id", (err, res) => {
//     if (err) throw err;
//     const mgrArray = [];
//     const mgrObj = [];

//     inquirer.prompt([{
//             name: "manager",
//             type: "list",
//             choices() {
//                 res.forEach(({ id, m.first_name, m.last_name }) => {
//                     mgrArray.push(`${first_name} ${last_name}`);
//                     mgrObj.push({ id, first_name, last_name });
//                 });
//                 console.log(mgrArray);
//                 return mgrArray;
//             },
//             message: "Select new employee's MANAGER: "
//         }])
// .then((answer) => {
//     let roleID;
//     for (let i = 0; i < mgrObj.length; i++) {
//         if (answer.choice === mgrObj[i]) {
//             mgrID = mgrObj[i].id;
//         };
//         //console.log("Role id " + roleID);//TEST
//     };

//     connection.query("INSERT INTO employee SET ?", {
//             first_name: answer.empFirstName,
//             last_name: answer.empLastName,
//             role_id: roleID,
//             //manager_id: mgrID//TODO: FIX TO ADD MGR ID
//         },
//         (err, res) => {
//             if (err) throw err;
//             console.log(`${answer.empFirstName} ${answer.empLastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
//             startTracker();
//         });
// });
//});








//******ADD NEW EMPLOYEE ******WORKING
// const addNewEmployee = () => {
//     const rolesArray = []; //to hold titles for choices display options
//     const roleObj = [] //to hold id + titles to grab role.id for sql INSERT
//     connection.query("SELECT id, title FROM roles", (err, res) => {
//         if (err) throw err;

//         inquirer.prompt([{
//                     name: "empFirstName",
//                     type: "input",
//                     message: "Please enter new employee FIRST NAME: ",
//                 },
//                 {
//                     name: "empLastName",
//                     type: "input",
//                     message: "Enter new employee LAST NAME: ",
//                 },
//                 {
//                     name: "choice",
//                     type: "list",
//                     choices() {
//                         res.forEach(({ id, title }) => {
//                             rolesArray.push(title);
//                             roleObj.push({ id, title });
//                         });
//                         // console.log(rolesArray); //TEST
//                         // console.log(roleObj);
//                         return rolesArray;
//                     },
//                     message: "Select new employee's ROLE: "
//                 }

//             ])
//             .then((answer) => {
//                 // console.log(res);
//                 // console.log(answer);
//                 // console.log(roleObj);
//                 // console.log("Under Answers " + rolesArray); //TEST
//                 let roleID;
//                 for (let i = 0; i < roleObj.length; i++) {
//                     if (answer.choice === roleObj[i].title) {
//                         roleID = roleObj[i].id;
//                     };
//                     //console.log("Role id " + roleID);//TEST
//                 };

//                 connection.query("INSERT INTO employee SET ?", {
//                         first_name: answer.empFirstName,
//                         last_name: answer.empLastName,
//                         role_id: roleID,
//                         //manager_id: mgrID//TODO: FIX TO ADD MGR ID
//                     },
//                     (err, res) => {
//                         if (err) throw err;
//                         console.log(`${answer.empFirstName} ${answer.empLastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
//                         startTracker();
//                     });
//                 //TODO: ADD MANAGER ID TO NEW EMPLOYEE
//                 // connection.query("SELECT e.id, concat(m.first_name, ' ', m.last_name) FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id", (err, res) => {
//                 //     if (err) throw err;
//                 //     const mgrArray = [];
//                 //     const mgrObj = [];

//                 //     inquirer.prompt([{
//                 //             name: "manager",
//                 //             type: "list",
//                 //             choices() {
//                 //                 res.forEach(({ id, m.first_name, m.last_name }) => {
//                 //                     mgrArray.push(`${first_name} ${last_name}`);
//                 //                     mgrObj.push({ id, first_name, last_name });
//                 //                 });
//                 //                 console.log(mgrArray);
//                 //                 return mgrArray;
//                 //             },
//                 //             message: "Select new employee's MANAGER: "
//                 //         }])
//                 // .then((answer) => {
//                 //     let roleID;
//                 //     for (let i = 0; i < mgrObj.length; i++) {
//                 //         if (answer.choice === mgrObj[i]) {
//                 //             mgrID = mgrObj[i].id;
//                 //         };
//                 //         //console.log("Role id " + roleID);//TEST
//                 //     };

//                 //     connection.query("INSERT INTO employee SET ?", {
//                 //             first_name: answer.empFirstName,
//                 //             last_name: answer.empLastName,
//                 //             role_id: roleID,
//                 //             //manager_id: mgrID//TODO: FIX TO ADD MGR ID
//                 //         },
//                 //         (err, res) => {
//                 //             if (err) throw err;
//                 //             console.log(`${answer.empFirstName} ${answer.empLastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
//                 //             startTracker();
//                 //         });
//                 // });
//                 //});
//             });
//     });
// };


// //****************UPDATE*************************
// const updateEmployeeRole = () => {

// }







// //****************DELETIONS*************************
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