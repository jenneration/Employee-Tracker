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
INSERT INTO department (name) VALUES ("HR");
INSERT INTO department (name) VALUES ("Facilities");
INSERT INTO department (name) VALUES ("Dispatch");
INSERT INTO department (name) VALUES ("Accounting");
INSERT INTO department (name) VALUES ("Kitchen");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Administration");


-- Roles 
INSERT INTO roles (title, salary, dept_id) VALUES ("CEO", 300000, 1);
INSERT INTO roles (title, salary, dept_id) VALUES ("COO", 200000, 1);
INSERT INTO roles (title, salary, dept_id) VALUES ("Executive Chef", 150000,6);
INSERT INTO roles (title, salary, dept_id) VALUES ("HR Director", 90000, 2); 
INSERT INTO roles (title, salary, dept_id) VALUES ("Facilities Manager", 120000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Fleet Manager", 75000, 4);
INSERT INTO roles (title, salary, dept_id) VALUES ("Security", 90000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Sales Director", 95000, 7);
INSERT INTO roles (title, salary, dept_id) VALUES ("Event Designer", 80000, 7);
INSERT INTO roles (title, salary, dept_id) VALUES ("Accountant", 65000, 5);
INSERT INTO roles (title, salary, dept_id) VALUES ("Maintenance Staff", 55000, 3);
INSERT INTO roles (title, salary, dept_id) VALUES ("Driver", 47000, 4);
INSERT INTO roles (title, salary, dept_id) VALUES ("Cook", 48888, 6);
INSERT INTO roles (title, salary, dept_id) VALUES ("Executive Assistant", 65000, 6);




-- Executive
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Thorin", "Oakenshield", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gandalf", "DaGrey", 2, null);

--HR
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Radagast", "Zard", 4, 25);

-- Managers
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bard", "Bowman", 6, 25);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gollum", "Reyes", 5, 25);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Smaug", "LeDragon", 3, 25);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Thranduil", "Elks", 8, 25);



-- Exec Administration
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bilbo", "Baggins", 14, 24);

-- Accounting, Accountants -- loin
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Gloin", "Banks", 10, 25);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Oin", "Greene", 10, 25);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nori", "Jenkins", 10, 25);

--Dispatch, Drivers -- Bard
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Beorn", "Bear", 12, 27);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fili", "Elks", 12, 27);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kili", "Elks", 12, 27);


--Security #-- Mrg Gollum
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Balin", "Petrovic", 7, 28);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dwalin", "Andjelkovic", 7, 28);

-- Maintenance Staff -- Gollum
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Trollman", 11, 28);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bert", "Stroll", 11, 28);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("William", "Trollins", 11, 28);

-- Kitchen  Cooks -- Smaug
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bifur", "Jones", 13, 29);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bombur", "Huggins", 13, 29);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dori", "Danilov", 13, 29);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ori", "Hudson", 13, 29);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bofur", "Garcia", 13, 29);


--Event Designers -- Thanduil
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Legolas", "Robertson", 9, 30);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Elrond", "Rivers", 9, 30);