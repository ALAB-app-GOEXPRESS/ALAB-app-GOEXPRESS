package com.alab.goexpress.seat;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SeatMapper {
  List<String> reservedSeats (
    @Param("train_cd") String train_cd,
    @Param("departure_date") String departure_date
  );
}
