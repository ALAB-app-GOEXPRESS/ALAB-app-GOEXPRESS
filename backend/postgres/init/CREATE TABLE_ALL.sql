CREATE TABLE M_STATION (
    station_cd CHAR(2),
    station_name VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (station_cd)
);

CREATE TABLE M_TRAIN_TYPE (
    train_type_cd CHAR(2),
    train_type_name VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (train_type_cd)
);

CREATE TABLE M_TRAIN (
    train_cd CHAR(5),
    train_type_cd CHAR(2) NOT NULL,
    train_number VARCHAR(4) NOT NULL,

    PRIMARY KEY (train_cd),

    FOREIGN KEY (train_type_cd) REFERENCES M_TRAIN_TYPE (train_type_cd)
);

CREATE TABLE M_SEAT_TYPE (
    seat_type_cd CHAR(2),
    seat_name VARCHAR(255) NOT NULL,
    seat_type_icon VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (seat_type_cd)
);

CREATE TABLE M_TRAIN_CAR (
    train_cd CHAR(5),
    train_car_cd CHAR(2),
    seat_type_cd CHAR(2) NOT NULL,
    max_seat_number INT NOT NULL,

    PRIMARY KEY (train_cd,train_car_cd),

    FOREIGN KEY (train_cd) REFERENCES M_TRAIN (train_cd),
    FOREIGN KEY (seat_type_cd) REFERENCES M_SEAT_TYPE (seat_type_cd)
);

CREATE TABLE M_CHARGE (
    departure_station_cd CHAR(2),
    arrival_station_cd CHAR(2),
    train_type_cd CHAR(2),
    seat_type_cd CHAR(2),
    charge INT,

    PRIMARY KEY (departure_station_cd, arrival_station_cd, train_type_cd, seat_type_cd),

    FOREIGN KEY (departure_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (arrival_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (train_type_cd) REFERENCES M_TRAIN_TYPE (train_type_cd),
    FOREIGN KEY (seat_type_cd) REFERENCES M_SEAT_TYPE (seat_type_cd)
);

CREATE TABLE M_PLAN (
    train_cd CHAR(5),
    departure_station_cd CHAR(2),
    arrival_station_cd CHAR(2),
    departure_time TIME,
    arrival_time TIME,
    departure_track_number CHAR(2),
    arrival_track_number CHAR(2),

    PRIMARY KEY (train_cd,departure_station_cd, arrival_station_cd),

    FOREIGN KEY (train_cd) REFERENCES M_TRAIN (train_cd),
    FOREIGN KEY (departure_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (arrival_station_cd) REFERENCES M_STATION (station_cd)
);


CREATE TABLE T_ACCOUNT (
    account_id INT,
    account_name VARCHAR(255),
    email_address VARCHAR(255),
    password VARCHAR(255),
    card_number CHAR(16),
    expiration_date DATE,

    PRIMARY KEY (account_id)
);

CREATE TABLE T_SEARCH_HISTORY (
    search_history_id INT GENERATED ALWAYS AS IDENTITY,
    account_id INT,
    departure_date DATE,
    departure_time TIME,
    departure_station_cd CHAR(2),
    arrival_station_cd CHAR(2),
    search_datetime TIMESTAMP,

    PRIMARY KEY (search_history_id),

    FOREIGN KEY (account_id) REFERENCES T_ACCOUNT (account_id)
);

CREATE TABLE T_RESERVATION (
    reservation_id INT GENERATED ALWAYS AS IDENTITY,
    invalid_flg BOOLEAN,
    account_id INT,
    departure_date DATE,
    buy_datetime TIMESTAMP,
    buyer_name VARCHAR(255),
    email_address VARCHAR(255),
    card_number VARCHAR(16),
    expiration_date DATE,

    PRIMARY KEY (reservation_id),

    FOREIGN KEY (account_id) REFERENCES T_ACCOUNT (account_id)
);

CREATE TYPE use_status AS ENUM ('unused','used','canceled');

CREATE TABLE T_TICKET (
    reservation_id INT,
    train_cd CHAR(5),
    departure_date DATE,
    train_car_cd CHAR(2),
    seat_cd CHAR(3),
    departure_station_cd CHAR(2),
    arrival_station_cd CHAR(2),
    charge INT,
    user_name VARCHAR(255),
    email_address VARCHAR(255),
    status use_status NOT NULL,

    PRIMARY KEY (reservation_id, train_cd, departure_date, train_car_cd, seat_cd, departure_station_cd, arrival_station_cd),

    FOREIGN KEY (reservation_id) REFERENCES T_RESERVATION (reservation_id),
    FOREIGN KEY (train_cd,train_car_cd) REFERENCES M_TRAIN_CAR (train_cd,train_car_cd),
    FOREIGN KEY (departure_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (arrival_station_cd) REFERENCES M_STATION (station_cd)
);

CREATE TABLE T_SEAT (
    train_cd CHAR(5),
    departure_date DATE,
    train_car_cd CHAR(2),
    seat_cd CHAR(3),
    departure_station_cd CHAR(2),
    arrival_station_cd CHAR(2),
    reservation_id INT,

    PRIMARY KEY (train_cd, departure_date, train_car_cd, seat_cd, departure_station_cd, arrival_station_cd),

    FOREIGN KEY (train_cd,train_car_cd) REFERENCES M_TRAIN_CAR (train_cd,train_car_cd),
    FOREIGN KEY (departure_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (arrival_station_cd) REFERENCES M_STATION (station_cd),
    FOREIGN KEY (reservation_id) REFERENCES T_RESERVATION (reservation_id)
);
