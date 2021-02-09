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


-- !!!!!!! REFERENCE FOR ASSIGNMENT !!!!!!!!
-- DELETE LATER
INSERT INTO department (id, name)
VALUES(1, "Executives"), (2, "HR"), (3, "Fleet/Facilities"), (4, "Kitchen"), (5, "Security"), (6, "Sales"), (7, "Accounting"), ;

INSERT INTO roles (id, title, salary, dept_id)
VALUES(22, "CEO", 300000, 1), (23, "COO", 200000, 1), (24, "Facilities Manager", 100000), 4, (25, "Executive Chef", 150000, 4), (26,"Fleet/Facilities Manager", 120000, 3), (27, "Security", 90000, 5),(28, "Sales Director", 95000, 6), (29, "Event Designer", 80000, 6), (30, "Accountant", 65000, 7), (31, "Maintenance Staff", 55000, 3), (32, "Driver", 47000, 3), (33, "Cook", 48888, 4); 


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Thorin", "Oakenshield", "CEO");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Gandalf", "DaGrey", "COO");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bilbo", "Baggins", "Executive Assistant");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Radagast" "Zard", "HR ");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Gloin", "Banks", "CFO");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Oin", "Greene", "Accountant");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Nori", "Jenkins", "Accountant");


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bard", "Bowman", "Fleet/Facilities Manager");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Beorn", "Bear", "Driver");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Fili" "Elks", "Driver");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Kili" "Elks", "Driver");


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Dwalin", "Andjelkovic", "Security");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Balin", "Petrovic", "Security");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Tom", "Trollman", "Maintenance Staff");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bert", "Stroll", "Maintenance Staff");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("William", "Trollins", "Maintenance Staff");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Smaug", "LeDragon", "Executive Cook");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bifur", "Jones", "Sous Chef");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bombur", "Huggins", "Cook");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Dori", "Danilov", "Cook");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Ori", "Hudson", "Cook");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Bofur", "Garcia", "Cook");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Gollum" "Reyes", "Cook");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Thranduil" "Elks", "Sales Director");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Legolas" "Robertson", "Event Designer");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Elrond" "Rivers", "Event Designer");





