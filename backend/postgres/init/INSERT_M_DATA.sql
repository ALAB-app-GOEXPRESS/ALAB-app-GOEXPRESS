INSERT INTO M_PLAN (train_cd, arrival_station_cd, arrival_time, departure_time, track_number)
VALUES
  ('3001B', '01', '08:20:00', '08:20:00', '01'),
  ('3001B', '04', '09:10:00', '09:11:00', '02');

INSERT INTO M_CHARGE (departure_station_cd, arrival_station_cd, train_type_cd, seat_type_cd, charge)
VALUES
  ('01', '04', '01', '10', 2000);

