-- =========================
-- トランザクション開始（任意）
-- =========================
BEGIN;

-- -------------------------
-- トランザクション系テーブル
-- -------------------------
DROP TABLE IF EXISTS T_SEAT;

DROP TABLE IF EXISTS T_TICKET;

DROP TABLE IF EXISTS T_RESERVATION;

DROP TABLE IF EXISTS T_SEARCH_HISTORY;

DROP TABLE IF EXISTS T_ACCOUNT;

-- -------------------------
-- マスタ系テーブル
-- -------------------------
DROP TABLE IF EXISTS M_PLAN;

DROP TABLE IF EXISTS M_CHARGE;

DROP TABLE IF EXISTS M_TRAIN_CAR;

DROP TABLE IF EXISTS M_TRAIN;

DROP TABLE IF EXISTS M_SEAT_TYPE;

DROP TABLE IF EXISTS M_TRAIN_TYPE;

DROP TABLE IF EXISTS M_STATION;

-- -------------------------
-- ENUM型（最後に消す）
-- -------------------------
DROP TYPE IF EXISTS use_status;

-- =========================
-- 確定
-- =========================
COMMIT;