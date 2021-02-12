DROP DATABASE IF EXISTS midEarthInk_db;

CREATE DATABASE midEarthInk_db;

USE midEarthInk_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dept_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


-- Departments
INSERT INTO department (name) VALUES ("Executives");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Facilities");
INSERT INTO department (name) VALUES ("Dispatch");
INSERT INTO department (name) VALUES ("Kitchen");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Administration");


-- Roles 
INSERT INTO roles (title, salary, dept_id) VALUES ("CEO", 300000, 1);
INSERT INTO roles (title, salary, dept_id) VALUES ("COO", 200000, 1);
INSERT INTO roles (title, salary, dept_id) VALUES ("CFO", 90000, 2); 
INSERT INTO roles (title, salary, dept_id) VALUES ("Facilities Manager", 120000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Fleet Manager", 75000, 4);
INSERT INTO roles (title, salary, dept_id) VALUES ("Executive Chef", 150000,5);
INSERT INTO roles (title, salary, dept_id) VALUES ("Sales Director", 95000, 6);

INSERT INTO roles (title, salary, dept_id) VALUES ("Accountant", 65000, 2);
INSERT INTO roles (title, salary, dept_id) VALUES ("Event Designer", 80000, 6);
INSERT INTO roles (title, salary, dept_id) VALUES ("Cook", 48888, 5);
INSERT INTO roles (title, salary, dept_id) VALUES ("Security", 90000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Maintenance Staff", 55000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Driver", 47000, 4);
INSERT INTO roles (title, salary, dept_id) VALUES ("Executive Assistant", 65000, 7);


-- Executive CEO, COO
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Thorin", "Oakenshield", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gandalf", "DaGrey", 2, null);

--CFO
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Radagast", "Zard", 3, 2);

-- Managers
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gollum", "Reyes", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bard", "Bowman", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Smaug", "LeDragon", 6, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Thranduil", "Elks", 7, 2);



-- Exec Administration
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bilbo", "Baggins", 14, 1);

-- Accounting, Accountants -- loin
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gloin", "Banks", 8, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Oin", "Greene", 8, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nori", "Jenkins", 8, 3);

--Dispatch, Drivers -- Bard
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Beorn", "Bear", 13, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fili", "Elks", 13, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kili", "Elks", 13, 5);


--Security #-- Mrg Gollum
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Balin", "Petrovic", 11, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dwalin", "Andjelkovic", 11, 4);

-- Maintenance Staff -- Gollum
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Trollman", 12, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bert", "Stroll", 12, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("William", "Trollins", 12, 4);

-- Kitchen  Cooks -- Smaug
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bifur", "Jones", 10, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bombur", "Huggins", 10, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dori", "Danilov", 10, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ori", "Hudson", 10, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bofur", "Garcia", 10, 6);


--Event Designers -- Thanduil
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Legolas", "Robertson", 9, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Elrond", "Rivers", 9, 7);




///*****TEST ADD EMP */
const addNewEmployee = () => {
    let rolesArray = []; //to hold titles for choices display options
    let roleObj = [] //to hold id + titles to grab role.id for sql INSERT
    let mgrArray = []; //to hold titles for choices display options
    let mgrObj = [] //to hold id + titles to grab role.id for sql INSERT
    const roleQuery = "SELECT * FROM roles";
    const mgrQuery = "SELECT concat(m.first_name + ' ' + m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.manager_id = e.id";
    
    connection.query(roleQuery, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, title }) => {
            rolesArray.push(title);
            roleObj.push({ id, title });
        });
        // console.log(rolesArray); //TEST
        // console.log(roleObj);
        return rolesArray;
    });
    connection.query(mgrQuery, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name }) => {
            mgrArray.push(first_name, last_name);
            mgrObj.push({ id, first_name, last_name });
        });
        console.log(mgrArray); //TEST
        console.log(mgrObj);
        return mgrArray;
    });

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
                choices: rolesArray,
                message: "What is the new employee's ROLE? "
            },
            {
                name: "choice",
                type: "list",
                choices: mgrArray,
                message: "Select new employee's MANAGER: "
            }
        ])
        .then((answer) => {
            // console.log(res);
            // console.log(answer);
            // console.log(roleObj);
            // console.log("Under Answers " + rolesArray); //TEST
            let roleID;
            for (let i = 0; i < roleObj.length; i++) {
                if (answer.choice === roleObj[i].title) {
                    roleID = roleObj[i].id;
                };
                //console.log("Role id " + roleID);//TEST
            };
            let mgID;
            for (let i = 0; i < roleObj.length; i++) {
                if (answer.choice === mgrObj[i].title) {
                    mgrID = mgrObj[i].id;
                };
                //console.log("Role id " + roleID);//TEST
            };

            connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.empFirstName,
                    last_name: answer.empLastName,
                    role_id: roleID,
                    manager_id: mgrID
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${answer.empFirstName} ${answer.empLastName} HAS BEEN ADDED TO COMPANY EMPLOYEES`);
                    startTracker();
                });
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
        });
};