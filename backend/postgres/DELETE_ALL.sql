-- =========================
-- トランザクション開始（任意だが強く推奨）
-- =========================
BEGIN;

-- -------------------------
-- トランザクション系（子 → 親）
-- -------------------------
DELETE FROM T_SEAT;

DELETE FROM T_TICKET;

DELETE FROM T_RESERVATION;

DELETE FROM T_SEARCH_HISTORY;

DELETE FROM T_ACCOUNT;

-- -------------------------
-- マスタ系（依存関係の深い順）
-- -------------------------
DELETE FROM M_PLAN;

DELETE FROM M_CHARGE;

DELETE FROM M_TRAIN_CAR;

DELETE FROM M_TRAIN;

DELETE FROM M_SEAT_TYPE;

DELETE FROM M_TRAIN_TYPE;

DELETE FROM M_STATION;

-- =========================
-- 確定
-- =========================
COMMIT;