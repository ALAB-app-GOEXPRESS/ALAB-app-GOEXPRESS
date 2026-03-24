INSERT INTO
    M_STATION (station_cd, station_name)
VALUES
    ('01', '東京'), ('02', '上野'), ('03', '大宮'), ('04', '小山'), ('05', '宇都宮'),
    ('06', '那須塩原'), ('07', '新白河'), ('08', '郡山'), ('09', '福島'), ('10', '白石蔵王'),
    ('11', '仙台'), ('12', '古川'), ('13', 'くりこま高原'), ('14', '一ノ関'), ('15', '水沢江刺'),
    ('16', '北上'), ('17', '新花巻'), ('18', '盛岡'), ('19', 'いわて沼宮内'), ('20', '二戸'),
    ('21', '八戸'), ('22', '七戸十和田'), ('23', '新青森');


INSERT INTO
    M_TRAIN_TYPE (train_type_cd, train_type_name)
VALUES
    ('01', 'はやぶさ'), ('02', 'はやて'), ('03', 'やまびこ'), ('04', 'なすの');


INSERT INTO
    M_SEAT_TYPE (seat_type_cd, seat_name, seat_type_icon)
VALUES
    ('10', '指定席', 'test'), ('20', 'グリーン車', 'test'), ('30', 'グランクラス', 'test');


INSERT INTO
    T_ACCOUNT (account_id, account_name, email_address, password, card_number, expiration_date)
VALUES
    (101, 'tarou', '123@example.com', 'aiueo', '1234567890123456', '2026-02-10'),
    (102, 'jirou', 'aiueo@example.com', 'irohani', '3214321347902321', '2026-02-10'),
    (103, 'hanako', '546@example.com', 'hoheto', '9218319461221498', '2026-02-10'),
    (104, 'takeo', 'kikuchi@example.com', 'tirinuruw0', '1243249247821432', '2026-02-10'),
    (105, 'sanae', 'takaichi@example.com', 'yokoham@', '2159247829238412', '2026-02-10'),
    (106, 'shinjirou', 'ko-izumi@example.com', 'mIrai', '2361234062149821', '2026-02-10');


INSERT INTO
    T_SEARCH_HISTORY (account_id, departure_date, departure_time, departure_station_cd, arrival_station_cd, search_datetime)
VALUES
    (101, '2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:00:00'),
    (101, '2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:00:30'),
    (101, '2026-02-10', '11:25:00', '01', '04', '2026-02-09 16:01:00'),
    (102, '2026-02-10', '08:20:00', '01', '04', '2026-02-10 13:02:00'),
    (102, '2026-02-10', '09:20:00', '01', '04', '2026-02-10 13:02:30'),
    (103, '2026-02-10', '08:25:00', '01', '04', '2026-02-09 17:10:00');


WITH station_order AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd) AS ord FROM M_STATION)
INSERT INTO M_CHARGE (departure_station_cd, arrival_station_cd, train_type_cd, seat_type_cd, charge)
SELECT dep.station_cd, arr.station_cd, tt.train_type_cd, st.seat_type_cd, ABS(dep.ord - arr.ord) * 1000
FROM station_order dep JOIN station_order arr ON dep.station_cd <> arr.station_cd
CROSS JOIN M_TRAIN_TYPE tt CROSS JOIN M_SEAT_TYPE st;




-- =================================================================
-- はやぶさ (01) 下り
-- パラメータ: ('H', '01', 6, 22, 20, 'ASC', 10, 0)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '0 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), '01', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '0 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '0 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- はやぶさ (01) 上り
-- パラメータ: ('J', '01', 6, 22, 20, 'DESC', 10, 5)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), '01', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- はやて (02) 下り
-- パラメータ: ('T', '02', 6, 22, 25, 'ASC', 12, 2)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), '02', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- はやて (02) 上り
-- パラメータ: ('U', '02', 6, 22, 25, 'DESC', 12, 7)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), '02', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- やまびこ (03) 下り
-- パラメータ: ('Y', '03', 6, 22, 15, 'ASC', 15, 3)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), '03', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- やまびこ (03) 上り
-- パラメータ: ('Z', '03', 6, 22, 15, 'DESC', 15, 8)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), '03', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- なすの (04) 下り
-- パラメータ: ('N', '04', 6, 22, 30, 'ASC', 18, 1)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), '04', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- なすの (04) 上り
-- パラメータ: ('M', '04', 6, 22, 30, 'DESC', 18, 6)
-- =================================================================
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), '04', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;


WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '20', 56), ('03', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);


WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so
WHERE (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59'
  AND (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';
