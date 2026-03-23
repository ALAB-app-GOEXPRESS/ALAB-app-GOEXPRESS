package com.alab.goexpress.reservation.adapter.out.persistence.mybatis;

import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row.ReservationHeaderRow;
import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row.TicketOperationRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservationQueryMapper {
  List<ReservationHeaderRow> selectReservationHeaders(
    @Param("size") int size,
    @Param("offset") int offset,
    @Param("sort") String sort,
    @Param("accountId") int accountId
  );

  long countReservations(@Param ("accountId") int accountId);

  List<TicketOperationRow> selectTicketsWithOperationByReservationIds(
    @Param("reservationIds") List<Integer> reservationIds
  );

  ReservationHeaderRow selectReservationHeaderById(@Param("reservationId") int reservationId);
}
