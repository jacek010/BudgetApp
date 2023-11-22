CREATE DATABASE budget_db;
USE budget_db;

create table budgets
(
    Budget_id                 int auto_increment
        primary key,
    Budget_name               varchar(30)   not null,
    Budget_description        varchar(255)  null,
    Budget_encrypted_password varchar(1024) not null
);

create table categories
(
    Category_id          int auto_increment
        primary key,
    Category_name        varchar(30)                   not null,
    Category_description varchar(255)                  not null,
    Category_color       varchar(25) default 'is-dark' not null,
    constraint categories_pk
        unique (Category_name)
);

create index categories_Category_name_index
    on categories (Category_name);

create table subcategories
(
    Subcategory_id          int auto_increment
        primary key,
    Subcategory_name        varchar(30)  not null,
    Subcategory_description varchar(255) null,
    Category_id             int          not null,
    constraint subcategories_pk2
        unique (Subcategory_name),
    constraint subcategories___fk
        foreign key (Category_id) references categories (Category_id)
);

create table reminders
(
    Reminder_id              int auto_increment
        primary key,
    Reminder_name            varchar(50)    not null,
    Reminder_description     varchar(255)   null,
    Reminder_date            date           not null,
    Budget_id                int            not null,
    Reminder_value           decimal(10, 2) not null,
    Reminder_repeat_quantity int            not null,
    Reminder_repeat_scale    varchar(10)    not null,
    Subcategory_id           int            not null,
    constraint reminders_budgets_Budget_id_fk
        foreign key (Budget_id) references budgets (Budget_id),
    constraint reminders_subcategories_Subcategory_id_fk
        foreign key (Subcategory_id) references subcategories (Subcategory_id)
);

create table users
(
    User_id              int auto_increment
        primary key,
    User_name            varchar(20)  not null,
    User_surname         varchar(30)  not null,
    User_email           varchar(40)  not null,
    User_hashed_password varchar(255) not null,
    Budget_id            int          null,
    constraint users_pk
        unique (User_email),
    constraint users_ibfk_1
        foreign key (Budget_id) references budgets (Budget_id)
);

create table operations
(
    Operation_id    int auto_increment
        primary key,
    Operation_name  varchar(30)    not null,
    Budget_id       int            null,
    User_id         int            null,
    Subcategory_id  int            not null,
    Operation_value decimal(10, 2) not null,
    Operation_date  date           not null,
    constraint operations_ibfk_1
        foreign key (Budget_id) references budgets (Budget_id),
    constraint operations_ibfk_2
        foreign key (User_id) references users (User_id),
    constraint operations_subcategories_Subcategory_id_fk
        foreign key (Subcategory_id) references subcategories (Subcategory_id)
);

create index Budget_id
    on operations (Budget_id);

create index User_id
    on operations (User_id);

create index Budget_id
    on users (Budget_id);


--Begin of IMPORTS

INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (0, 'UNCATEGORIZED', 'Operations without category', 'is-white');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (1, 'food', 'Szamka', 'is-warning');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (2, 'entertainment', 'Kino i inne', 'is-black');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (3, 'transport', 'Paliwko', 'is-link');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (4, 'fees', 'Prąd, woda, internet', 'is-primary');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (6, 'studies', 'Kursy, programy, ogólnie nauka', 'is-danger');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (7, 'inwestitions', 'Akcje, waluta', 'is-info');
INSERT INTO budget_db.categories (Category_id, Category_name, Category_description, Category_color) VALUES (8, 'work', 'Salary, extra pays, rewards', 'is-success');


INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (0, 'uncategorized', 'uncategorized operation', 0);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (1, 'FastFood', 'McD', 1);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (2, 'Regional cousine', 'Schabowe', 1);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (3, 'Kino', 'Wyjścia do kina', 2);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (4, 'Theater', 'Wyjścia do teatru', 2);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (6, 'Opera', 'Wyjścia do opery', 2);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (7, 'Bus', 'Bilet MPK', 3);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (8, 'Train', 'Bilety na PKP', 3);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (9, 'Internet', 'Opłata za internet', 4);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (10, 'Water', 'Opłata za wodę czystą', 4);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (11, 'Id Card', 'Opłata za wydanie legitymacji', 6);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (12, 'Programing lessons', 'Opłata za kurs programowania', 6);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (14, 'Actions', 'Zakup akcji na giełdzie', 7);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (15, 'Waluta', 'Zakup obcej waluty', 7);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (16, 'KFC', 'Crispy chicken', 1);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (17, 'Electricity', 'Pay for power', 4);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (18, 'Plane', 'Plane tickets', 3);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (19, 'PIzza', 'good Italian stuff', 1);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (20, 'Salary', 'Money for regular work', 8);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (21, 'Contract', 'Contracts for specific work', 8);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (22, 'Bonus', 'Bonus for work', 8);
INSERT INTO budget_db.subcategories (Subcategory_id, Subcategory_name, Subcategory_description, Category_id) VALUES (23, 'Car', 'Fuel to car', 3);


INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (0, 'placeholder', 'placeholder', 'placeholder');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (1, 'Budget1', 'testetstet', '');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (2, 'Home budget', 'Testowy budźet domowy', '');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (4, 'API_budget', 'Budget created by FastAPI, and edited by it', '');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (6, 'test_api', 'string', '$2b$12$jHUP3T1j5DElbRV7BVMZVu5wOrMt7Z4F.L8p4QTtpHYwhlYDgEyta');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (7, 'string', 'string', '$2b$12$Rq9a7z/sjcaWVPgzLAdkoeLKZRotG.CUjvQWHBpTJfvUpr9IadRG6');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (8, 'string', 'string', '$2b$12$VdHWECoIZ0oKYIoRoWmTJOdvd3E3BmvbwdZBKaMKSslskh0rT9Z7.');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (9, 'string', 'string', '$2b$12$XNphBxFjhpSMgdyr6Ps6f.j6Tu0DYfuQ4jEPZn7Cik6ETF3LyJ7iO');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (10, 'string', 'string', '$2b$12$KqmyYigYAOmkluimv3Ba/.ZfiC4izpnP5RIZhi73svrk6ggMOCx4K');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (11, 'string', 'string', '$2b$12$/wSUwX0VsB.qx9.gJrBj2.sooqlckyi4UQUDNWYoKEo7HOWZIyBxe');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (12, 'test_budget', 'string', '$2b$12$GgdqI8VmOZv5/S1oqhCoi.BdsEdULnsQNzOQUx5VArGj7Q4PExUG6');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (13, 'stringenc', 'string', 'gAAAAABlO3sC3jvqDze9IdxpevoHgpYtL_JMmFEK9TiKW9hBXkNA9EyEOyt5_d5DDf4O7mnYTdFe41WMF7f7q-RRNSBuu3OknQ==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (14, 'stringencoded', 'string', 'gAAAAABlO3uqj5fDVUyYPttqeunHlcJ7A9dwOVwOShSCftfRtywvy3_y9ufR3g4-Mu5lYTg1XeeQdWojHx45eFTEEJPF2ebJUg==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (15, 'stringencoded', 'string', 'gAAAAABlO3ywkyhnOfjHkSI9C0g23zxge3RMBRO0YSUxOhe0xTfH74HELTm3q4sBeAS8Z__x8hUqKOzwpMdKCJS1zNdmje72gA==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (16, 'budget1', 'string', 'gAAAAABlO4SHskFSaSJpDsQxIxn4ZOD-qKYKiR1xuFOhDn7keIaXbUHoZjUQ4qAQRlXpyb8HdIrzSEJ9dJjoiRtpc0s1KVPtfQ==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (17, 'budget2', 'string', 'gAAAAABlO4STVvrMBlTFbcstDXm8fdIFOjhXqmkeJXbFTLSnCyaJoTOr7-GtCEtDeEcIFAkArZzpkK9hT0qBcDQVhRG1tZ4emQ==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (20, 'newbudget', 'name=password', 'gAAAAABlO5T_CVvbBwc2x2reZ18Ri1wZbaGmEcxJKxA7Gy67Ajt8VunYX9JdFJQU3KeROVQqaSHc1UcPqQV8XUEySqBod6S_wg==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (21, 'najsbudget', 'name=password', 'gAAAAABlTp02GEgkoK-SN3a17TqKy4Z8uw0ZX67NaUVE-50dRI_ziV8PLXXkOBv6jau2eZi6TgDYjAdMtEgVqI7wi68pfpBpMQ==');
INSERT INTO budget_db.budgets (Budget_id, Budget_name, Budget_description, Budget_encrypted_password) VALUES (22, 'thirdbudget', 'name=pass', 'gAAAAABlO7VsjYsmbv1NVAZPQDPVEdDeg92GvwS198YCBSt63s3-Bu2Lnw8d3T3NfQ8BXO0SIDTXETmLYt5mcS99_OB7xCjppA==');


INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (0, 'Admin', 'ADMIN', 'budgetadmin@admin', '$2b$12$VPc.CtMlmht/EBtv7qysM.ceSXmFYNnHYi/PiCik1VYwox4QMuuxC', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (1, 'Jacek', 'Myjkowski', 'jacek', 'jacek', 2);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (4, 'string', 'string', 'jmyjkowski@gmail.com', 'string', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (6, 'string', 'string', 'mail@mail.com', '$2b$12$SidBUAtv4YBD6svR5hCTcuOrO8RSoi1Nn1DtZF28MEvUJFU0VzUge', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (7, 'string', 'string', 'maile@mail.com', '$2b$12$M01olQ2FdqfEQxbqSdDIMODhgqZtQM8QX0ji8w3bHnevYzlPVta/S', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (8, 'Test', 'Testowy', 'testowy@mail.com', '$2b$12$Ct09klf4mXnp/FFc4IDP2OkupdW0uBKAn4IxoB6ThSzn/wruk/b5y', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (9, 'Test', 'Testowy', 'testowy1@mail.com', '$2b$12$StbEqWZLNXwnbxlcgPFNAOYtg5Ope7DOCG1CDMDgcy8B/Q96gdWRy', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (10, 'string', 'string', 'string@mail', '$2b$12$3AlRSfMyCO8GIm7OyiP7U.KZ.01BJ1jrMXhyelLXmeCGmcyxLoRFe', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (11, 'jaca', 'poprostu', 'www@xxx', '$2b$12$cKpEYem0US.Kvwj3aDj9zuUDkMPy4JmjTeC.Wh0rCqF8FSOhUbw4m', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (12, 'jan', 'jan', 'jan@jan1', '$2b$12$xlkkbwAthyeBmQxdw.lpy.0oN/e4uIkVtyKEvfKxAsuTwFkbsLv06', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (13, 'jan', 'jan', 'jan@jan122', '$2b$12$QVpsiQ/pq4c0ZpJP.4cQ..H25GmQttiv.iEXjoEsBGP0ajc/XCCmK', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (14, 'string', 'string', 'string', '$2b$12$Rwl68of1mvP9dggy3y0TiOTeVzfTqrRNNuOE916T293OcWBqMh7Ae', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (16, 'string', 'string', 'qqq', '$2b$12$Nlp8fG6Lw1c.L02LnupKk.90zeVL.0kR2eyNQh7WMHNgtLJi/jM5S', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (17, 'Fajny', 'ziomek', 'ziomek@mail', '$2b$12$PJ2GCVfminjE5P/LiQm.2OCrr5Gm3MpQX7q3TRZiijATxi317bXx2', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (18, 'string', 'string', 'yyy', '$2b$12$GcOPW/ytmk3QY0BrMgNaTOn3klMIn09AyquK4g3A1mGz0OTn28mMC', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (19, 'string', 'string', 'ddd', '$2b$12$ld7be5vQnMo/VCnvePgHk.MDF7wn67NTFJOOVSnxYhY.0CxeUofv.', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (21, 'string', 'string', 'fff', '$2b$12$W.zwzwn4HgmD1woeDPOqWOUN4/XMdx4EtJNLMBlObYoKaKJ1meO3G', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (22, 'string', 'string', 'kkk', '$2b$12$Ld.kE.JXA0Li/yb885QPDOEVaHbcgyukrg/CPRKrbXXcDWb5mafwC', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (23, 'string', 'aaa', 'aaa', '$2b$12$qYo2jDxRo5KtV2Tf6IlZT.wQg.UjonZm4M3yu2m2VLfVh1VPYxXUG', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (24, 'string', 'aaa', 'bbb', '$2b$12$3FQoYlPPx7OXFcqE237TIOc7rYPqDcBoEfv2noewySn0LtKmu4wZi', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (25, 'Ziomeczek', 'Ziomkowski', 'ziomkowski@gmail.com', '$2b$12$MvdkJfC6zMX6gxIMcodcWeXwbb.aNOHD4.nyFMKF6RJa.oYrJIzBm', 21);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (26, 'test1', 'q', 'qqq@gmail.com', '$2b$12$u0j3UFg60EJSeOtjnEQvYeH009yeFql9f6RRFI7ht7luV7Q9uW9kS', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (27, 'string', 'string', 'stringwww', '$2b$12$6X3D7/o0nFBCEsH9xcBFle8/2nQz2/bg6Nif8rizGRKoQ.dgAEdqe', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (28, 'string', 'string', 'stringwww1', '$2b$12$tSEVqvBImvf76qQpDPEdgO4JyTSwU0dv6ruxBdHNt1fLIBgHtySdm', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (29, 'string', 'string', 'stringaaa', '$2b$12$glc2LF6gzJk4seBjV1lRAOQfPe6OCDP.V0VECP5006zoq16c0BXkm', 1);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (30, 'string', 'string', 'no_budget@qq', '$2b$12$LSwJxRUEWKRImZFqMbdyQOqUQy9PuwwPW9MXVrUon5HEUL84TI3y2', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (31, 'string', 'string', 'no_budget@qqq', '$2b$12$7/N4auPFeETeu0muCywUoO2n9tIPSumjjDOQ1wenCd4rI2iGfgcEq', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (32, 'zero', 'zero', 'zero@gmail.com', '$2b$12$QwyVxx1YXIb6yH5KmILSnukmi0L1jS18Qb1PaF3aa6b0KBik59NIe', 20);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (34, 'Kolega', 'Kolegowski', 'kolegowski@gmail.com', '$2b$12$W1IO0NzCw1CDLLPKpTc8iOO0kdhY/QXzjBen.302NUoJlUbIPsDEi', 21);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (35, 'Przyjaciel', 'Przyjacielski', 'przyjacielski@gmail.com', '$2b$12$XY0F8kdO3XHoQEW8O8KMeOSx3oi7QrkQGjdkycti7ifRFlyqjw82q', 21);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (36, 'Znajomy', 'Znajomski', 'znajomski@gmail.com', '$2b$12$GmYd0OGWaIHXYahPNDuMZOaBF2hU07DMeaoDtsvgwcUsoCFLfEyFG', 0);
INSERT INTO budget_db.users (User_id, User_name, User_surname, User_email, User_hashed_password, Budget_id) VALUES (56, 'Testowy', 'Użytkownik', 'testowyuzytkownik@gmail.com', '$2b$12$uPVgArvilH8yB/CjzWNyL.8IZ5OasEYf9DOOn/HIDmkJAaaifhoNu', 0);


INSERT INTO budget_db.reminders (Reminder_id, Reminder_name, Reminder_description, Reminder_date, Budget_id, Reminder_value, Reminder_repeat_quantity, Reminder_repeat_scale, Subcategory_id) VALUES (2, 'Woda', 'Zapłacić za wodę', '2024-05-15', 21, -134.87, 3, 'months', 10);
INSERT INTO budget_db.reminders (Reminder_id, Reminder_name, Reminder_description, Reminder_date, Budget_id, Reminder_value, Reminder_repeat_quantity, Reminder_repeat_scale, Subcategory_id) VALUES (3, 'Bilet MPK', 'Kupić bilet dwutygodniowy', '2024-02-12', 21, -16.50, 14, 'days', 7);
INSERT INTO budget_db.reminders (Reminder_id, Reminder_name, Reminder_description, Reminder_date, Budget_id, Reminder_value, Reminder_repeat_quantity, Reminder_repeat_scale, Subcategory_id) VALUES (4, 'Ubezpieczenie samochodu', 'Wykupienie nowego ubezpieczenia', '2025-11-27', 21, -1459.73, 1, 'years', 23);
INSERT INTO budget_db.reminders (Reminder_id, Reminder_name, Reminder_description, Reminder_date, Budget_id, Reminder_value, Reminder_repeat_quantity, Reminder_repeat_scale, Subcategory_id) VALUES (6, 'Za kurs', 'Opłata abonamentu za kurs programowania', '2024-03-01', 21, -30.00, 1, 'months', 12);
INSERT INTO budget_db.reminders (Reminder_id, Reminder_name, Reminder_description, Reminder_date, Budget_id, Reminder_value, Reminder_repeat_quantity, Reminder_repeat_scale, Subcategory_id) VALUES (7, 'Internet', 'oplata za internet', '2024-03-23', 21, -65.10, 1, 'months', 9);


INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (1, '', 2, 1, 2, 50.00, '2023-10-14');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (2, '', 2, 1, 1, -30.00, '2023-10-20');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (3, '', 2, 1, 1, -21.37, '2023-10-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (5, 'Spektakl Dziady', 2, 1, 4, -155.50, '2023-10-23');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (8, 'Duży zestaw', 2, 1, 1, -22.50, '2023-10-23');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (9, 'Pierwsza operacja', 21, 25, 6, 33.50, '2023-10-31');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (10, 'Operacja z fastapi', 21, 25, 1, 45.50, '2023-10-31');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (13, 'Obciążenie konta', 21, 25, 4, -25.45, '2023-10-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (15, 'www', 21, 25, 4, -15.34, '2023-10-19');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (16, 'www', 21, 25, 4, 56.15, '2023-10-12');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (17, 'qwee', 21, 25, 6, 12.90, '2023-10-13');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (19, 'wypłata z pracy', 21, 25, 6, 2500.00, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (20, 'test', 21, 25, 6, 321.00, '2023-11-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (21, 'dodanie', 21, 25, 15, -1345.00, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (24, 'test', 20, 32, 6, 1234.00, '2023-11-08');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (25, 'Pizza', 21, 34, 1, -45.95, '2023-10-31');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (26, 'Pizza', 21, 34, 1, -45.95, '2023-10-31');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (27, 'wawwa', 21, 34, 6, 2000.00, '2023-11-10');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (28, 'aa', 21, 34, 6, 123.00, '2023-11-01');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (29, 'za', 21, 25, 6, 12.00, '2023-11-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (30, 'qq', 21, 25, 6, 123.00, '2023-11-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (31, 'qq', 21, 25, 6, 123.00, '2023-11-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (32, 'q', 21, 25, 6, 1234.00, '2023-11-02');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (33, 'testowa', 21, 34, 6, -3009.87, '2023-11-03');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (34, 'kreska', 21, 25, 6, -3000.00, '2023-11-05');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (36, 'Payment', 21, 25, 11, -18.45, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (37, '', 21, 25, 6, 1111.00, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (38, '', 21, 25, 8, 8888.00, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (39, 'w', 21, 25, 15, 345.00, '2023-11-06');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (40, 'qw', 21, 25, 10, 1211.00, '2023-11-09');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (41, 'mm', 21, 25, 17, 111.00, '2023-11-10');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (42, 'nn', 21, 25, 9, 11.12, '2023-11-10');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (43, 'aktualizacja kategorii', 21, 25, 9, -8888.00, '2023-11-09');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (44, 'Salary for December 2023', 21, 25, 20, 4500.00, '2023-11-10');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (45, 'Bilet MPK', 21, 25, 7, -16.50, '2024-01-29');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (46, 'Za kurs', 21, 25, 12, 30.00, '2024-03-01');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (47, 'Internet', 21, 25, 9, -45.10, '2023-12-23');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (48, 'WYpłata', 21, 25, 21, 3500.00, '2023-11-13');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (49, 'Internet', 21, 25, 9, -65.10, '2024-01-23');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (50, 'Internet', 21, 25, 9, -65.10, '2024-02-23');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (51, 'test expense', 21, 25, 14, -56.00, '2023-11-11');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (52, 'test expense 2', 21, 25, 11, -134.00, '2023-11-11');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (53, 'Testowa 1', 21, 25, 3, -56.00, '2023-11-15');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (54, 'Bilet MPK', 21, 25, 7, -16.50, '2024-02-12');
INSERT INTO budget_db.operations (Operation_id, Operation_name, Budget_id, User_id, Subcategory_id, Operation_value, Operation_date) VALUES (56, 'testowa', 21, 36, 11, 56.98, '2023-11-17');

