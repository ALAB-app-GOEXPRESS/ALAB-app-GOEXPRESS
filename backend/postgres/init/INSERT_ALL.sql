INSERT INTO M_STATION (station_cd, station_name)
VALUES
    ('01', '東京'),
    ('02', '上野'),
    ('03', '大宮'),
    ('04', '小山'),
    ('05', '宇都宮'),
    ('06', '那須塩原'),
    ('07', '新白河'),
    ('08', '郡山'),
    ('09', '福島'),
    ('10', '白石蔵王'),
    ('11', '仙台'),
    ('12', '古川'),
    ('13',  'くりこま高原'),
    ('14', '一ノ関'),
    ('15', '水沢江刺'),
    ('16', '北上'),
    ('17', '新花巻'),
    ('18', '盛岡'),
    ('19', 'いわて沼宮内'),
    ('20', '二戸'),
    ('21', '八戸'),
    ('22', '七戸十和田'),
    ('23', '新青森');

INSERT INTO M_TRAIN_TYPE (train_type_cd, train_type_name)
VALUES
    ('01','はやぶさ'),
    ('02','はやて'),
    ('03','やまびこ'),
    ('04','なすの');

INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number)
VALUES
    ('2049B','01','0049'),
    ('3001B','01','0001'),
    ('0091B','02','0091'),
    ('0093B','02','0093'),
    ('0051B','03','0051'),
    ('0201B','03','0201'),
    ('0251B','04','0251'),
    ('0255B','04','0255');

INSERT INTO M_SEAT_TYPE (seat_type_cd, seat_name, seat_type_icon)
VALUES
    ('10','指定席','test'),
    ('20','グリーン車','test'),
    ('30','グランクラス','test');

INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number)
VALUES
    ('2049B','01','10',85),
    ('2049B','02','10',85),
    ('2049B','03','10',85),
    ('2049B','04','10',85),
    ('2049B','05','10',85),
    ('2049B','06','10',85),
    ('2049B','07','10',85),
    ('2049B','08','10',85),
    ('2049B','09','20',56),
    ('2049B','10','30',18),
    ('3001B','01','10',85),
    ('3001B','02','10',85),
    ('3001B','03','10',85),
    ('3001B','04','10',85),
    ('3001B','05','10',85),
    ('3001B','06','10',85),
    ('3001B','07','10',85),
    ('3001B','08','10',85),
    ('3001B','09','20',56),
    ('3001B','10','30',18),
    ('0091B','01','10',85),
    ('0091B','02','10',85),
    ('0091B','03','10',85),
    ('0091B','04','10',85),
    ('0091B','05','10',85),
    ('0091B','06','10',85),
    ('0091B','07','10',85),
    ('0091B','08','10',85),
    ('0091B','09','20',56),
    ('0091B','10','30',18);

INSERT INTO M_CHARGE (departure_station_cd, arrival_station_cd, train_type_cd, seat_type_cd, charge)
VALUES
    ('01', '04', '01', '10',1000);

INSERT INTO M_PLAN (train_cd, departure_station_cd, arrival_station_cd, departure_time, arrival_time, departure_track_number, arrival_track_number)
VALUES
    ('3001B', '01', '04', '11:23:45' , '12:30:45', '21','13');

INSERT INTO T_ACCOUNT (account_id, account_name, email_address, password, card_number, expiration_date)
VALUES
    (101,'tarou','123@example.com', 'aiueo', '1234567890123456','2026-02-10'),
    (102,'jirou','aiueo@example.com', 'irohani', '3214321347902321','2026-02-10'),
    (103,'hanako','546@example.com', 'hoheto', '9218319461221498','2026-02-10'),
    (104,'takeo','kikuchi@example.com', 'tirinuruw0', '1243249247821432','2026-02-10'),
    (105,'sanae','takaichi@example.com', 'yokoham@', '2159247829238412','2026-02-10'),
    (106,'shinjirou','ko-izumi@example.com', 'mIrai', '2361234062149821','2026-02-10');

INSERT INTO T_SEARCH_HISTORY (account_id, departure_date, departure_time, departure_station_cd, arrival_station_cd, search_datetime)
VALUES
    (101,'2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:00:00'),
    (101,'2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:00:30'),
    (101,'2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:01:00'),
    (102,'2026-02-10', '08:20:00', '01', '04', '2026-02-10 13:02:00'),
    (102,'2026-02-10', '09:20:00', '01', '04', '2026-02-10 13:02:30'),
    (103,'2026-02-10', '08:25:00', '01', '04', '2026-02-09 17:10:00');

INSERT INTO T_RESERVATION (invalid_flg, account_id, departure_date, buy_datetime, buyer_name, email_address, card_number, expiration_date)
VALUES
    (FALSE,101,'2026-02-10','2026-02-09 16:00:00', 'tarou', '123@example.com', '1234567890123456', '2026-02-09'),
    (FALSE,102,'2026-02-10','2026-02-09 16:01:00', 'jirou', 'aiueo@example.com', '3214321347902321', '2026-02-09'),
    (FALSE,103,'2026-02-11','2026-02-10 17:00:00', 'hanako', '546@example.com', '9218319461221498', '2026-02-10'),
    (FALSE,104,'2026-02-11','2026-02-10 17:02:00', 'takeo', 'kikuchi@example.com', '1243249247821432', '2026-02-10'),
    (TRUE,105,'2026-02-12','2026-02-11 10:03:00', 'sanae', 'takaichi@example.com', '2159247829238412', '2026-02-10'),
    (TRUE,106,'2026-02-12','2026-02-11 10:03:00', 'shinjirou', 'ko-izumi@example.com', '2361234062149821', '2026-02-10');

INSERT INTO T_TICKET (reservation_id,train_cd, departure_date, train_car_cd, seat_cd, departure_station_cd, arrival_station_cd, charge, user_name, email_address, status)
VALUES
    (1,'3001B','2026-02-10','10', '012', '01','04',12345,'sunohara','123@example.com', 'unused');

INSERT INTO T_SEAT (train_cd, departure_date, train_car_cd, seat_cd, departure_station_cd, arrival_station_cd,reservation_id)
VALUES
    ('3001B','2026-02-10','10', '012', '01','04',1);
    