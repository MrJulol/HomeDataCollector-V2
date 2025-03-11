create table if not exists t_device
(
    ID   int auto_increment
        primary key,
    Name varchar(32) not null
);

create table if not exists t_room
(
    ID   int auto_increment
        primary key,
    Name varchar(32) null
);

create table if not exists t_status
(
    ID     int auto_increment
        primary key,
    Device int null,
    constraint t_status_ibfk_1
        foreign key (Device) references t_device (ID)
);

create index Device
    on t_status (Device);

create table if not exists t_temp
(
    ID       int auto_increment
        primary key,
    Room     int          null,
    Date     datetime     not null,
    Temp     float        not null,
    Humidity int unsigned not null,
    constraint t_temp_ibfk_1
        foreign key (Room) references t_room (ID)
);

create index Room
    on t_temp (Room);

create table if not exists t_user
(
    ID   int auto_increment
        primary key,
    Name varchar(32)  not null,
    Age  int unsigned not null
);

create table if not exists t_drive
(
    ID       int auto_increment
        primary key,
    Driver   int          null,
    Duration int unsigned null,
    Distance int unsigned null,
    KMBefore int unsigned null,
    Diesel   int unsigned null,
    Date     datetime     not null,
    constraint t_drive_ibfk_1
        foreign key (Driver) references t_user (ID)
);

create index Driver
    on t_drive (Driver);

create table if not exists t_step
(
    ID    int auto_increment
        primary key,
    User  int          null,
    Date  date         not null,
    Steps int unsigned not null,
    constraint t_step_ibfk_1
        foreign key (User) references t_user (ID)
);

create index User
    on t_step (User);

