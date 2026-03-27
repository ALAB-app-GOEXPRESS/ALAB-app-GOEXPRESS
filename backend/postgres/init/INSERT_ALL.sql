-- =================================================================
-- マスターデータおよび基本データ投入
-- =================================================================
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
    (101, 'tarou', 'tsunohara@jeisryokai.onmicrosoft.com', 'aiueo', '1234567890123456', '2026-02-10'),
    (102, 'jirou', 'aiueo@example.com', 'irohani', '3214321347902321', '2026-02-10'),
    (103, 'hanako', '546@example.com', 'hoheto', '9218319461221498', '2026-02-10'),
    (104, 'takeo', 'kikuchi@example.com', 'tirinuruw0', '1243249247821432', '2026-02-10'),
    (105, 'sanae', 'takaichi@example.com', 'yokoham@', '2159247829238412', '2026-02-10'),
    (106, 'shinjirou', 'ko-izumi@example.com', 'mIrai', '2361234062149821', '2026-02-10');


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
-- 満席テストデータ作成
-- =================================================================
DO $$
DECLARE
    target_train RECORD;
    target_account RECORD;
    v_train_car_cds TEXT[];
    v_seat_cds TEXT[];
    v_account_id INT;
    new_reservation_id INT;
    v_departure_date DATE := CURRENT_DATE;
    i INT;
    target_trains_cursor CURSOR FOR
        SELECT
            train_cd,
            train_number_counter % 8 AS pattern_type
        FROM (
            -- 全車種の列車情報を結合
            SELECT 'H' || LPAD(ts.train_number_counter::text, 4, '0') AS train_cd, ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'J' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '5 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '20 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'T' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '2 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'U' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '7 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '25 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'Y' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '3 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'Z' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '8 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '15 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'N' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '1 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter) UNION ALL
            SELECT 'M' || LPAD(ts.train_number_counter::text, 4, '0'), ts.train_number_counter FROM generate_series('2000-01-01 06:00:00'::timestamp + '6 minutes'::interval, '2000-01-01 22:00:00'::timestamp, '30 minutes'::interval) WITH ORDINALITY AS ts(start_time_val, train_number_counter)
        ) AS all_trains
        WHERE (train_number_counter % 8) <> 0;
BEGIN
    OPEN target_trains_cursor;
    LOOP
        FETCH target_trains_cursor INTO target_train;
        EXIT WHEN NOT FOUND;

        -- 1. 予約対象となる座席の「車両番号」と「座席番号」を、それぞれ別の配列に格納する
        SELECT
            array_agg(train_car_cd),
            array_agg(seat_cd)
        INTO
            v_train_car_cds,
            v_seat_cds
        FROM (
            SELECT
                co.train_car_cd,
                LPAD((co.seat_offset + s.seat_num)::text, 3, '0') AS seat_cd
            FROM
                (SELECT train_car_cd, seat_type_cd, max_seat_number, SUM(max_seat_number) OVER (ORDER BY train_car_cd) - max_seat_number AS seat_offset FROM M_TRAIN_CAR WHERE train_cd = target_train.train_cd) co
            CROSS JOIN
                LATERAL generate_series(1, co.max_seat_number) AS s(seat_num)
            WHERE
                (
                    (target_train.pattern_type = 1 AND co.seat_type_cd = '10') OR
                    (target_train.pattern_type = 2 AND co.seat_type_cd = '20') OR
                    (target_train.pattern_type = 3 AND co.seat_type_cd = '30') OR
                    (target_train.pattern_type = 4 AND co.seat_type_cd IN ('10', '20')) OR
                    (target_train.pattern_type = 5 AND co.seat_type_cd IN ('10', '30')) OR
                    (target_train.pattern_type = 6 AND co.seat_type_cd IN ('20', '30')) OR
                    (target_train.pattern_type = 7)
                )
            ORDER BY seat_cd
        ) AS seats;

        -- 2. 配列に格納した座席を6席ずつのグループでループ処理
        IF array_length(v_seat_cds, 1) > 0 THEN
            FOR i IN 0..CEIL(array_length(v_seat_cds, 1) / 6.0) - 1
            LOOP
                -- 3. グループごとに新しい予約を作成
                v_account_id := 101 + ((target_train.pattern_type + i) % 6);
                SELECT * INTO target_account FROM T_ACCOUNT WHERE account_id = v_account_id;

                INSERT INTO T_RESERVATION (
                    invalid_flg, account_id, departure_date, buy_datetime,
                    buyer_name, email_address, card_number, expiration_date
                )
                VALUES (
                    false, target_account.account_id, v_departure_date, CURRENT_TIMESTAMP,
                    target_account.account_name, target_account.email_address,
                    target_account.card_number, target_account.expiration_date
                )
                RETURNING reservation_id INTO new_reservation_id;

                -- 4. 新しい予約番号に、該当グループの座席(最大6席)を紐づける
                INSERT INTO T_SEAT (
                    train_cd, departure_date, train_car_cd, seat_cd,
                    departure_station_cd, arrival_station_cd, reservation_id
                )
                SELECT
                    target_train.train_cd,
                    v_departure_date,
                    car_cd,
                    s_cd,
                    '01', '23', new_reservation_id
                FROM
                    unnest(
                        v_train_car_cds[i*6 + 1 : (i+1)*6],
                        v_seat_cds[i*6 + 1 : (i+1)*6]
                    ) AS t(car_cd, s_cd);

            END LOOP;
        END IF;

    END LOOP;
    CLOSE target_trains_cursor;
END;
$$;
