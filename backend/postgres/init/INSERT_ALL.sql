
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

CREATE OR REPLACE FUNCTION generate_all_train_data(
    train_prefix CHAR(1),
    train_type CHAR(2),
    start_hour INT,
    end_hour INT,
    interval_minutes INT,
    station_order_direction TEXT,
    travel_time_per_station INT,
    start_minute_offset INT
) RETURNS void AS $$
DECLARE
    train_number_counter INT := 1;
    start_time_val TIMESTAMP;
BEGIN
    FOR start_time_val IN SELECT generate_series(
        ('2000-01-01 ' || start_hour || ':00:00')::timestamp + (start_minute_offset || ' minutes')::interval,
        ('2000-01-01 ' || end_hour || ':00:00')::timestamp,
        (interval_minutes || ' minutes')::interval
    )
    LOOP
        INSERT INTO M_TRAIN (train_cd, train_type_cd, train_number)
        VALUES (train_prefix || LPAD(train_number_counter::text, 4, '0'), train_type, LPAD(train_number_counter::text, 4, '0'));

        WITH car_definitions AS (
            SELECT '01' AS train_car_cd, '10' AS seat_type_cd, 75 AS max_seat_number UNION ALL
            SELECT '02' AS train_car_cd, '20' AS seat_type_cd, 56 AS max_seat_number UNION ALL
            SELECT '03' AS train_car_cd, '30' AS seat_type_cd, 18 AS max_seat_number
        )
        INSERT INTO M_TRAIN_CAR (train_cd, train_car_cd, seat_type_cd, max_seat_number)
        SELECT train_prefix || LPAD(train_number_counter::text, 4, '0'), cd.train_car_cd, cd.seat_type_cd, cd.max_seat_number
        FROM car_definitions cd;

        WITH station_orders AS (
            SELECT station_cd, ROW_NUMBER() OVER (ORDER BY CASE WHEN station_order_direction = 'ASC' THEN station_cd END ASC, CASE WHEN station_order_direction = 'DESC' THEN station_cd END DESC) AS station_order
            FROM M_STATION
        ),
        plan_candidates AS (
            SELECT
                so.station_cd,
                (start_time_val::time + (so.station_order - 1) * (travel_time_per_station || ' minutes')::interval) AS arrival,
                (start_time_val::time + (so.station_order - 1) * (travel_time_per_station || ' minutes')::interval + '50 seconds'::interval) AS departure
            FROM station_orders so
        )
        INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
        SELECT
            train_prefix || LPAD(train_number_counter::text, 4, '0'),
            pc.station_cd,
            pc.arrival,
            pc.departure,
            '15'
        FROM plan_candidates pc
        WHERE pc.arrival >= start_time_val::time;

        train_number_counter := train_number_counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- はやぶさ (01)
SELECT generate_all_train_data('H', '01', 6, 22, 20, 'ASC', 10, 0); -- 下り
SELECT generate_all_train_data('J', '01', 6, 22, 20, 'DESC', 10, 5);-- 上り
-- はやて (02)
SELECT generate_all_train_data('T', '02', 6, 22, 25, 'ASC', 12, 2); -- 下り
SELECT generate_all_train_data('U', '02', 6, 22, 25, 'DESC', 12, 7);-- 上り
-- やまびこ (03)
SELECT generate_all_train_data('Y', '03', 6, 22, 15, 'ASC', 15, 3); -- 下り
SELECT generate_all_train_data('Z', '03', 6, 22, 15, 'DESC', 15, 8);-- 上り
-- なすの (04)
SELECT generate_all_train_data('N', '04', 6, 22, 30, 'ASC', 18, 1); -- 下り
SELECT generate_all_train_data('M', '04', 6, 22, 30, 'DESC', 18, 6);-- 上り
