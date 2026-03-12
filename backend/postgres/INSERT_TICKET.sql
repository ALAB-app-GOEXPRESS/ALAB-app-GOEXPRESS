/* =========================================================
ファイル名: INSERT_TICKET.sql
内容: 過去・当日・未来日の予約、チケット、座席データを挿入します。
注意: このファイルを実行する前に、INSERT_ALL.sql を実行してください。
========================================================= */
/* =========================================================
1. 予約関連データ（過去日: 昨日）
========================================================= */
-- 予約テーブル
INSERT INTO
    T_RESERVATION (
        reservation_id,
        invalid_flg,
        account_id,
        departure_date,
        buy_datetime,
        buyer_name,
        email_address,
        card_number,
        expiration_date
    ) OVERRIDING SYSTEM VALUE
VALUES
    (
        3001,
        false,
        101,
        CURRENT_DATE - 1,
        CURRENT_TIMESTAMP,
        'tarou',
        '123@example.com',
        '1234567890123456',
        '2026-02-10'
    ),
    (
        3002,
        false,
        102,
        CURRENT_DATE - 1,
        CURRENT_TIMESTAMP,
        'jirou',
        'aiueo@example.com',
        '3214321347902321',
        '2026-02-10'
    );

-- チケットテーブル
INSERT INTO
    T_TICKET (
        reservation_id,
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        charge,
        user_name,
        email_address,
        status
    )
VALUES
    (
        3001,
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '003',
        '01',
        '11',
        5500,
        '山田 太郎',
        '123@example.com',
        'used'
    ),
    (
        3001,
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '047',
        '01',
        '11',
        5500,
        '山田 花子',
        '123@example.com',
        'used'
    ),
    (
        3002,
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '006',
        '01',
        '11',
        5500,
        '佐藤 次郎',
        'aiueo@example.com',
        'used'
    );

-- 座席予約テーブル
INSERT INTO
    T_SEAT (
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        reservation_id
    )
VALUES
    (
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '003',
        '01',
        '11',
        3001
    ),
    (
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '047',
        '01',
        '11',
        3001
    ),
    (
        '3001B',
        CURRENT_DATE - 1,
        '01',
        '006',
        '01',
        '11',
        3002
    );

/* =========================================================
2. 予約関連データ（当日: 今日）
========================================================= */
-- 予約テーブル
INSERT INTO
    T_RESERVATION (
        reservation_id,
        invalid_flg,
        account_id,
        departure_date,
        buy_datetime,
        buyer_name,
        email_address,
        card_number,
        expiration_date
    ) OVERRIDING SYSTEM VALUE
VALUES
    (
        1001,
        false,
        101,
        CURRENT_DATE,
        CURRENT_TIMESTAMP,
        'tarou',
        '123@example.com',
        '1234567890123456',
        '2026-02-10'
    ),
    (
        1002,
        false,
        102,
        CURRENT_DATE,
        CURRENT_TIMESTAMP,
        'jirou',
        'aiueo@example.com',
        '3214321347902321',
        '2026-02-10'
    );

-- チケットテーブル
INSERT INTO
    T_TICKET (
        reservation_id,
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        charge,
        user_name,
        email_address,
        status
    )
VALUES
    (
        1001,
        '3001B',
        CURRENT_DATE,
        '01',
        '003',
        '01',
        '11',
        5500,
        '山田 太郎',
        '123@example.com',
        'unused'
    ),
    (
        1001,
        '3001B',
        CURRENT_DATE,
        '01',
        '047',
        '01',
        '11',
        5500,
        '山田 花子',
        '123@example.com',
        'unused'
    ),
    (
        1002,
        '3001B',
        CURRENT_DATE,
        '01',
        '006',
        '01',
        '11',
        5500,
        '佐藤 次郎',
        'aiueo@example.com',
        'unused'
    );

-- 座席予約テーブル
INSERT INTO
    T_SEAT (
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        reservation_id
    )
VALUES
    (
        '3001B',
        CURRENT_DATE,
        '01',
        '003',
        '01',
        '11',
        1001
    ),
    (
        '3001B',
        CURRENT_DATE,
        '01',
        '047',
        '01',
        '11',
        1001
    ),
    (
        '3001B',
        CURRENT_DATE,
        '01',
        '006',
        '01',
        '11',
        1002
    );

/* =========================================================
3. 予約関連データ（未来日: 2026-04-01）
========================================================= */
-- 予約テーブル
INSERT INTO
    T_RESERVATION (
        reservation_id,
        invalid_flg,
        account_id,
        departure_date,
        buy_datetime,
        buyer_name,
        email_address,
        card_number,
        expiration_date
    ) OVERRIDING SYSTEM VALUE
VALUES
    (
        2001,
        false,
        101,
        '2026-04-01',
        CURRENT_TIMESTAMP,
        'tarou',
        '123@example.com',
        '1234567890123456',
        '2026-03-01'
    ),
    (
        2002,
        false,
        102,
        '2026-04-01',
        CURRENT_TIMESTAMP,
        'jirou',
        'aiueo@example.com',
        '3214321347902321',
        '2026-03-01'
    );

-- チケットテーブル
INSERT INTO
    T_TICKET (
        reservation_id,
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        charge,
        user_name,
        email_address,
        status
    )
VALUES
    (
        2001,
        '3001B',
        '2026-04-01',
        '01',
        '003',
        '01',
        '11',
        5500,
        '山田 太郎',
        '123@example.com',
        'unused'
    ),
    (
        2001,
        '3001B',
        '2026-04-01',
        '01',
        '047',
        '01',
        '11',
        5500,
        '山田 花子',
        '123@example.com',
        'unused'
    ),
    (
        2002,
        '3001B',
        '2026-04-01',
        '01',
        '006',
        '01',
        '11',
        5500,
        '佐藤 次郎',
        'aiueo@example.com',
        'unused'
    );

-- 座席予約テーブル
INSERT INTO
    T_SEAT (
        train_cd,
        departure_date,
        train_car_cd,
        seat_cd,
        departure_station_cd,
        arrival_station_cd,
        reservation_id
    )
VALUES
    (
        '3001B',
        '2026-04-01',
        '01',
        '003',
        '01',
        '11',
        2001
    ),
    (
        '3001B',
        '2026-04-01',
        '01',
        '047',
        '01',
        '11',
        2001
    ),
    (
        '3001B',
        '2026-04-01',
        '01',
        '006',
        '01',
        '11',
        2002
    );