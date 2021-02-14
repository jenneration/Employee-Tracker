
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




