create table budget_db.Budgets(
    Budget_id int PRIMARY KEY auto_increment,
    Budget_name varchar(30) NOT NULL,
    Budget_description varchar(255)
);

create table budget_db.Users(
  User_id int NOT NULL auto_increment,
  User_name varchar(20) NOT NULL,
  User_surname varchar(30) NOT NULL,
  User_login varchar(30) NOT NULL,
  User_password varchar(50) NOT NULL,
  Budget_id int,
  PRIMARY KEY (User_id),
  FOREIGN KEY (Budget_id) REFERENCES Budgets(Budget_id)
);

create table budget_db.Categories(
    Category_id int NOT NULL auto_increment,
    Category_name varchar(30) NOT NULL,
    Category_description varchar(255) not null,
    Category_color varchar(6) not null default 'ffffff',
    PRIMARY KEY (Category_id)
);

create table budget_db.subcategories
(
    Subcategory_id          int auto_increment,
    Subcategory_name        varchar(30)  not null,
    Subcategory_description varchar(255) null,
    Category_id             int          not null,
    constraint subcategories_pk
        primary key (Subcategory_id),
    constraint subcategories_pk2
        unique (Subcategory_name),
    constraint subcategories___fk
        foreign key (Category_id) references categories (Category_id)
);

create table budget_db.Operations(
    Operation_id int not null auto_increment,
    Budget_id int,
    User_id int,
    Subcategory_id int,
    Operation_value decimal(10,2) not null,
    Operation_date date not null,
    PRIMARY KEY (Operation_id),
    FOREIGN KEY (Budget_id) references Budgets(Budget_id),
    FOREIGN KEY (User_id) references Users(User_id),
    FOREIGN KEY (Subcategory_id) references Subcategories(Subcategory_id)
);


#automatically generated
create table Budgets
(
    Budget_id          int auto_increment
        primary key,
    Budget_name        varchar(30)  not null,
    Budget_description varchar(255) null
);

create table Categories
(
    Category_id          int auto_increment
        primary key,
    Category_name        varchar(30)                 not null,
    Category_description varchar(255)                not null,
    Category_color       varchar(6) default 'ffffff' not null
);

create table Users
(
    User_id       int auto_increment
        primary key,
    User_name     varchar(20) not null,
    User_surname  varchar(30) not null,
    User_login    varchar(30) not null,
    User_password varchar(50) not null,
    Budget_id     int         null,
    constraint Users_ibfk_1
        foreign key (Budget_id) references Budgets (Budget_id)
);

create table Operations
(
    Operation_id    int auto_increment
        primary key,
    Budget_id       int            null,
    User_id         int            null,
    Category_id     int            null,
    Operation_value decimal(10, 2) not null,
    Operation_date  date           not null,
    constraint Operations_ibfk_1
        foreign key (Budget_id) references Budgets (Budget_id),
    constraint Operations_ibfk_2
        foreign key (User_id) references Users (User_id),
    constraint Operations_ibfk_3
        foreign key (Category_id) references Categories (Category_id)
);

create index Budget_id
    on Operations (Budget_id);

create index Category_id
    on Operations (Category_id);

create index User_id
    on Operations (User_id);

create index Budget_id
    on Users (Budget_id);

