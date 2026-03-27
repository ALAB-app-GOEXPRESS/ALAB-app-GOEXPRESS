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
    (101, CURRENT_DATE + interval '1 day', '11:25:00', '01', '04', CURRENT_TIMESTAMP - interval '1 day'),
    (101, CURRENT_DATE + interval '1 day', '11:25:00', '01', '04', CURRENT_TIMESTAMP - interval '1 day' + interval '30 second'),
    (101, CURRENT_DATE + interval '1 day', '11:25:00', '01', '04', CURRENT_TIMESTAMP - interval '1 day' + interval '1 minute'),
    (102, CURRENT_DATE + interval '1 day', '08:20:00', '01', '04', CURRENT_TIMESTAMP),
    (102, CURRENT_DATE + interval '1 day', '09:20:00', '01', '04', CURRENT_TIMESTAMP + interval '30 second'),
    (103, CURRENT_DATE + interval '1 day', '08:25:00', '01', '04', CURRENT_TIMESTAMP - interval '1 day' + interval '1 hour');


WITH station_order AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd) AS ord FROM M_STATION)
INSERT INTO M_CHARGE (departure_station_cd, arrival_station_cd, train_type_cd, seat_type_cd, charge)
SELECT dep.station_cd, arr.station_cd, tt.train_type_cd, st.seat_type_cd, ABS(dep.ord - arr.ord) * 1000
        * CASE st.seat_type_cd WHEN '10' THEN 1.0 WHEN '20' THEN 1.5 WHEN '30' THEN 2.0 ELSE 1.0 END
FROM station_order dep JOIN station_order arr ON dep.station_cd <> arr.station_cd
CROSS JOIN M_TRAIN_TYPE tt CROSS JOIN M_SEAT_TYPE st;


-- =================================================================
-- 列車運行計画データ生成
-- =================================================================
-- はやぶさ (01) 下り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), '01', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- はやぶさ (01) 上り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), '01', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '10 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- はやて (02) 下り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), '02', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- はやて (02) 上り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), '02', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '12 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- やまびこ (03) 下り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), '03', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- やまびこ (03) 上り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), '03', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '15 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- なすの (04) 下り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), '04', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd ASC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- なすの (04) 上り
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number) SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), '04', LPAD(ts.train_number_counter::text, 4, '0') FROM time_series ts;
WITH time_series AS (SELECT ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val))
INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number) SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number FROM time_series ts CROSS JOIN (VALUES ('01', '10', 75), ('02', '10', 75), ('03', '10', 75), ('04', '10', 75), ('05', '10', 75), ('06', '10', 75), ('07', '10', 75), ('08', '10', 75), ('09', '20', 56), ('10', '30', 18)) AS cd(train_car_cd, seat_type_cd, max_seat_number);
WITH time_series AS (SELECT start_time_val, ROW_NUMBER() OVER (ORDER BY start_time_val) AS train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) AS t(start_time_val)), station_orders AS (SELECT station_cd, ROW_NUMBER() OVER (ORDER BY station_cd DESC) AS station_order FROM M_STATION)
INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), so.station_cd, (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval), (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval), '15'
FROM time_series ts CROSS JOIN station_orders so WHERE (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval) NOT BETWEEN '00:00:00' AND '05:59:59' AND (ts.start_time_val::time + (so.station_order - 1) * '18 minutes'::interval + '50 seconds'::interval) NOT BETWEEN '00:00:00' AND '05:59:59';


-- =================================================================
-- 満席テストデータ作成（全車種対応版）
-- 全ての列車に対して、周期的に全7パターンの満席状態を作成
-- =================================================================
DO $$
DECLARE
    target_train RECORD;
    new_reservation_id INT;
    v_departure_date DATE := CURRENT_DATE + interval '1 day'; -- 出発日を「明日」に設定
    target_trains_cursor CURSOR FOR
        SELECT
            train_cd,
            train_number_counter % 8 AS pattern_type
        FROM (
            -- はやぶさ(下り)
            SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- はやぶさ(上り)
            SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- はやて(下り)
            SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- はやて(上り)
            SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- やまびこ(下り)
            SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- やまびこ(上り)
            SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- なすの(下り)
            SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
            UNION ALL
            -- なすの(上り)
            SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter
            FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
        ) AS all_trains
        WHERE (train_number_counter % 8) <> 0; -- 8本に1本は完全空席にするため、pattern_typeが0の列車は処理しない
BEGIN
    -- 対象の列車をループで1件ずつ処理
    OPEN target_trains_cursor;
    LOOP
        FETCH target_trains_cursor INTO target_train;
        EXIT WHEN NOT FOUND;

        -- 列車ごとにダミーの予約を1件作成し、そのIDを取得
        INSERT INTO T_RESERVATION (
            invalid_flg, account_id, departure_date, buy_datetime,
            buyer_name, email_address, card_number, expiration_date
        )
        VALUES (
            false, 101, v_departure_date, CURRENT_TIMESTAMP,
            '満席 太郎', 'mansdeki@example.com', '9999999999999999', '2029-12-31'
        )
        RETURNING reservation_id INTO new_reservation_id;

        -- 取得した予約IDとパターンタイプを使って、座席を予約済みにする
        INSERT INTO T_SEAT (
            train_cd, departure_date, train_car_cd, seat_cd,
            departure_station_cd, arrival_station_cd, reservation_id
        )
        SELECT
            target_train.train_cd,
            v_departure_date,
            tc.train_car_cd,
            LPAD(s.seat_num::text, 3, '0'),
            '01', -- 出発駅は東京に固定
            '23', -- 到着駅は新青森に固定
            new_reservation_id
        FROM
            M_TRAIN_CAR tc
        CROSS JOIN
            LATERAL generate_series(1, tc.max_seat_number) AS s(seat_num)
        WHERE
            tc.train_cd = target_train.train_cd
            AND (
                -- pattern_type = 1: 指定席のみ
                (target_train.pattern_type = 1 AND tc.seat_type_cd = '10') OR
                -- pattern_type = 2: グリーン車のみ
                (target_train.pattern_type = 2 AND tc.seat_type_cd = '20') OR
                -- pattern_type = 3: グランクラスのみ
                (target_train.pattern_type = 3 AND tc.seat_type_cd = '30') OR
                -- pattern_type = 4: 指定席 + グリーン車
                (target_train.pattern_type = 4 AND tc.seat_type_cd IN ('10', '20')) OR
                -- pattern_type = 5: 指定席 + グランクラス
                (target_train.pattern_type = 5 AND tc.seat_type_cd IN ('10', '30')) OR
                -- pattern_type = 6: グリーン車 + グランクラス
                (target_train.pattern_type = 6 AND tc.seat_type_cd IN ('20', '30')) OR
                -- pattern_type = 7: 全席
                (target_train.pattern_type = 7)
            );
    END LOOP;
    CLOSE target_trains_cursor;
END;
$$;
 