const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var colors = require("colors"); //npm pack for colors
var figlet = require("figlet"); // or app header

//make the initializer for figlet a sync function so it appears before app runs
const message = figlet.textSync("Employee Tracker", {
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 100,
  whitespaceBreak: true,
});

console.log(message.rainbow.bold);

//Create connection to db
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  //MySQL password and targeted DB
  password: "Password123!",
  database: "midEarthInk_db",
});

//INITIALIZE APP
connection.connect((err) => {
  if (err) throw err;
  //console.log(`connected as id ${connection.threadId}`);
  startTracker();
});

//App starter function
const startTracker = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        //"View Department Budgets", -- Bonus 1 of 6, not done
        "View Departments",
        "View Roles",
        "View Employees-Full Data",
        "View Employee By Manager",
        "Add New Department",
        "Add New Role",
        "Add New Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        //case "View All Department Budgets":
        //viewDeptBudgets();
        //break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employees-Full Data":
          viewEmployees();
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
      }
    });
};

//****************READ*************************

//TO DO: View Departments and budgets based on employees in each
//View Department budgets
// const viewDeptBudgets = () => {

//         if (err) throw err;
//         console.table(res);
//         startTracker();
//     });
// };

//View All Department: name and id - use "AS" to format header names
const viewDepartments = () => {
  connection.query("SELECT id AS Dept_ID, name AS Department FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    startTracker();
  });
};

// View All Roles: show id, title, salary, associated department - "AS" functions as header formatter and alias for self join.
const viewRoles = () => {
  connection.query(
    "SELECT r.id AS Role_IDs, r.title AS Titles, r.salary AS Salaries, d.name AS Departments FROM roles AS r INNER JOIN department AS d ON r.dept_id  = d.id ORDER BY d.name ASC",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
};

// View All Employees & relate data: id, name, role, salary, mgr, dept - concat method used to join mgr name
const viewEmployees = () => {
  connection.query(
    "SELECT e.id AS Emp_ID, e.first_name AS First_Name, e.last_name AS Last_Name, roles.title AS Title, roles.salary AS Salary, department.name AS Department, concat(m.first_name, ' ', m.last_name) AS Manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id",
    (err, res) => {
      if (err) throw err;
      //Display results
      console.table(res);
      startTracker();
    }
  );
};

const viewEmpByManager = () => {
  connection.query(
    "SELECT e.id AS EmpID, concat(e.first_name, ' ', e.last_name) AS Employee, concat(m.first_name,' ', m.last_name) AS Manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id ORDER BY e.manager_id ASC",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
};

//****************CREATE*************************

//Add New Department
const addNewDepartment = () => {
  inquirer
    .prompt({
      name: "newDept",
      type: "input",
      message: "What department would you like to add?",
    })
    .then((answer) => {
      connection.query("INSERT INTO department SET ?", { name: answer.newDept }, (err, res) => {
        if (err) throw err;
        console.log(`**"${answer.newDept}" successfully added to Departments**`.yellow);
        startTracker();
      });
    });
};

//Add New Role with dept. id
const addNewRole = () => {
  const deptArray = [];
  connection.query("SELECT id, name FROM department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the Title for the New Role: ",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "What is the Salary for the New Role: ",
          //TODO: Fix validation
          validate(value) {
            if (isNaN(value) === false && value > 20000 && value < 250000) {
              return true;
            }
            console.log("Please enter a valid salary");
            return false;
          },
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
          message: "Select the Department for this role: ",
        },
      ])
      .then((answer) => {
        //Grab dept id of selected choice by filtering response
        let deptID;
        res.filter((dept) => {
          if (dept.name === answer.choice) {
            //console.log(newRole.id)
            return (deptID = dept.id);
          }
        });
        //Insert new role data into database
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.roleTitle,
            salary: answer.roleSalary,
            dept_id: deptID,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`**"${answer.roleTitle}" successfully added to company Roles**`.yellow);
            startTracker();
          }
        );
      });
  });
};

//Add New Employee with role and mgr. ids
const addNewEmployee = () => {
  const roleQuery = "SELECT * FROM roles";
  const mgrQuery = "SELECT * FROM employee";
  //This query receives employee name and provides choices for their role
  connection.query(roleQuery, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "empFirstName",
          type: "input",
          message: "Enter new employee First Name: ",
        },
        {
          name: "empLastName",
          type: "input",
          message: "Enter new employee Last Name: ",
        },
        {
          name: "choice",
          type: "list",
          choices() {
            let rolesArray = []; //to hold titles for choices
            res.forEach(({ title }) => {
              rolesArray.push(title);
            });
            return rolesArray;
          },
          message: "What is new employee's Role?",
        },
      ])
      .then((answer) => {
        //Declare name info to use later for db insert
        const firstName = answer.empFirstName;
        const lastName = answer.empLastName;
        //Grab role id based on user's selection above
        let roleID;
        res.filter((role) => {
          if (role.title === answer.choice) {
            return (roleID = role.id);
          }
        });
        //Segue to next query to determine new emp's manager
        if (answer.choice != "") {
          connection.query(mgrQuery, (err, res) => {
            if (err) throw err;
            connection.query(mgrQuery, (err, res) => {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "choice2",
                    type: "list",
                    choices() {
                      let mgrArray = ["Not Applicable"];
                      res.forEach(({ id, first_name, last_name }) => {
                        mgrArray.push(first_name + " " + last_name);
                      });
                      return mgrArray;
                    },
                    message: "Who is new employee's Manager?",
                  },
                ])
                .then((answer) => {
                  //Grab manager id
                  let mgrID;
                  res.filter((mgr) => {
                    if (mgr.first_name + " " + mgr.last_name === answer.choice2) {
                      console.log(mgr.id);
                      return (mgrID = mgr.id);
                    } else if (answer.choice2 === "Not Applicable") {
                      return (mgrID = null);
                    }
                  });
                  //Insert data into db
                  connection.query(
                    "INSERT INTO employee SET ?",
                    {
                      first_name: firstName,
                      last_name: lastName,
                      role_id: roleID,
                      manager_id: mgrID,
                    },
                    (err, res) => {
                      if (err) throw err;
                      console.log(`**"${firstName} ${lastName}" successfully added to company Employees**`.yellow);
                      startTracker();
                    }
                  );
                });
            });
          });
        }
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
      .prompt([
        {
          name: "employee",
          type: "list",
          choices() {
            let empArray = [];
            res.forEach(({ first_name, last_name }) => {
              empArray.push(first_name + " " + last_name);
            });
            //console.log(empArray);
            return empArray;
          },
          message: "Which employee will you update?",
        },
      ])
      .then((answer) => {
        let employee = answer.employee;
        let empID;
        //****REFACTOR THIS ?
        res.filter((emp) => {
          if (emp.first_name + " " + emp.last_name === answer.employee) {
            //console.log(emp.id)
            return (empID = emp.id);
          }
        });
        //Get roles for query
        if (answer.employee != "") {
          connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
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
                  message: "What is their new role?",
                },
              ])
              .then((answer) => {
                let roleID;
                res.filter((newRole) => {
                  if (newRole.title === answer.role) {
                    //console.log(newRole.id)
                    return (roleID = newRole.id);
                  }
                });
                //Update MySql DB
                connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                    {
                      role_id: roleID,
                    },
                    {
                      id: empID,
                    },
                  ],
                  (err, res) => {
                    if (err) throw err;
                    console.log(`**${employee}'s role successfully changed to ${answer.role}**`.yellow);
                    startTracker();
                  }
                );
              });
          });
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
      .prompt([
        {
          name: "employee",
          type: "list",
          choices() {
            let empArray = [];
            res.forEach(({ first_name, last_name }) => {
              empArray.push(first_name + " " + last_name);
            });
            return empArray;
          },
          message: "Which employee will you update?",
        },
      ])
      .then((answer) => {
        let employee = answer.employee;
        let empID;
        //****Can i make this way shorter?
        res.filter((emp) => {
          if (emp.first_name + " " + emp.last_name === answer.employee) {
            //console.log(emp.id)
            return (empID = emp.id);
          }
        });
        //Get employees for manager query
        if (answer.employee != "") {
          connection.query("SELECT * FROM employee", (err, res) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "mgr",
                  type: "list",
                  choices() {
                    let mgrArray = [];
                    res.forEach(({ first_name, last_name }) => {
                      mgrArray.push(first_name + " " + last_name);
                    });
                    //console.log(res);
                    return mgrArray;
                  },
                  message: "Select employee's new manager: ",
                },
              ])
              .then((answer) => {
                let mgrID;
                res.filter((newMgr) => {
                  if (newMgr.first_name + " " + newMgr.last_name === answer.mgr) {
                    //console.log(newMgr.id);
                    return (mgrID = newMgr.id);
                  }
                });
                //Update MySql DB
                connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                    {
                      manager_id: mgrID,
                    },
                    {
                      id: empID,
                    },
                  ],
                  (err, res) => {
                    if (err) throw err;
                    console.log(`**${employee}'s manager successfully updated to ${answer.mgr}**`.yellow);
                    startTracker();
                  }
                );
              });
          });
        }
      });
  });
};

// //****************DELETE*************************
//Deletes department
const deleteDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices() {
            const deptArray = [];
            res.forEach(({ name }) => {
              deptArray.push(`${name}`);
            });
            return deptArray;
          },
          message: "Which department will you delete?",
        },
      ])
      .then((answer) => {
        let department = answer.choice;
        let deptID;
        res.filter((dept) => {
          if (dept.name === answer.choice) {
            //console.log(answer);
            //console.log(dept.id);
            return (deptID = dept.id);
          }
        });
        inquirer
          .prompt([
            {
              name: "dblck",
              type: "list",
              message: "Confirm to delete this department",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.dblck === "Yes") {
              connection.query("DELETE FROM department WHERE ?", { id: deptID }, (err, res) => {
                if (err) throw err;
                console.log(`**"${department}" successfully deleted from Departments**`.red);
                startTracker();
              });
            }
          });
      });
  });
};

//Deletes Role and associated employee
const deleteRole = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices() {
            let rolesArray = [];
            res.forEach(({ title }) => {
              rolesArray.push(title);
            });
            return rolesArray;
          },
          message: "Which role will you delete?",
        },
      ])
      .then((answer) => {
        let deleted = answer.choice;
        let roleID;
        res.filter((role) => {
          if (role.title === answer.choice) {
            return (roleID = role.id);
          }
        });
        inquirer
          .prompt([
            {
              name: "dblck",
              type: "list",
              message: "Confirm to delete this role ",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.dblck === "Yes") {
              connection.query("DELETE FROM roles WHERE ?", { id: roleID }, (err, res) => {
                if (err) throw err;
                console.log(`**"${deleted}" successfully deleted from Roles**`.red);
                startTracker();
              });
            } else {
              console.log("Let's begin again\n");
              startTracker();
            }
          });
      });
  });
};

//Deletes Employee
const deleteEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices() {
            let empArray = [];
            res.forEach(({ first_name, last_name }) => {
              empArray.push(first_name + " " + last_name);
            });
            return empArray;
          },
          message: "Which employee will you delete?",
        },
      ])
      .then((answer) => {
        let empID;
        let emp = answer.choice;
        res.filter((emp) => {
          if (emp.first_name + " " + emp.last_name === answer.choice) {
            return (empID = emp.id);
          }
        });
        inquirer
          .prompt([
            {
              name: "dblck",
              type: "list",
              message: "Confirm to delete this employee ",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.dblck === "Yes") {
              connection.query("DELETE FROM employee WHERE ?", { id: empID }, (err, res) => {
                if (err) throw err;
                console.log(`**"${emp}" successfully deleted from Employees**`.red);
                startTracker();
              });
            } else {
              console.log("Let's begin again\n");
              startTracker();
            }
          });
      });
  });
};
