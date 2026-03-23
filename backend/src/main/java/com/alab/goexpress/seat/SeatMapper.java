package com.alab.goexpress.seat;

import java.time.LocalDate;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SeatMapper {
  List<SeatResponse> findReservedSeats (
    @Param("trainCd") String trainCd,
    @Param("departureDate") LocalDate departureDate
  );

  long countReservedSeatsInList( @Param("trainCd") String trainCd, @Param("depDate") LocalDate depDate, @Param("seatIdentifiers") List<String> seatIdentifiers );
}
