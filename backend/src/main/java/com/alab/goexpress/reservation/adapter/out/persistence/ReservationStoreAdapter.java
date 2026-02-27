package com.alab.goexpress.reservation.adapter.out.persistence;

import com.alab.goexpress.reservation.adapter.out.persistence.jpa.ReservationJpaRepository;
import com.alab.goexpress.reservation.adapter.out.persistence.mapper.ReservationEntityMapper;
import com.alab.goexpress.reservation.adapter.out.persistence.mapper.ReservationListAssembler;
import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.ReservationQueryMapper;
import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row.ReservationHeaderRow;
import com.alab.goexpress.reservation.application.port.out.ReservationStorePort;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class ReservationStoreAdapter implements ReservationStorePort {

  private final ReservationJpaRepository jpaRepo;
  private final ReservationQueryMapper queryMapper;

  @Override
  @Transactional
  public Reservation save(Reservation reservation) {
    var entity = ReservationEntityMapper.toEntity(reservation);
    var saved = jpaRepo.save(entity);
    return ReservationEntityMapper.toDomain(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<Reservation> findById(ReservationId reservationId) {
    return jpaRepo.findById(reservationId.value()).map(ReservationEntityMapper::toDomain);
  }

  @Override
  @Transactional
  public void deleteById(ReservationId reservationId) {
    jpaRepo.deleteById(reservationId.value());
  }

  @Override
  @Transactional(readOnly = true)
  public ReservationListView listAllWithTicketsAndOperation(int page, int size, String sortKey) {
    int offset = (page - 1) * size;

    var headers = queryMapper.selectReservationHeaders(size, offset, sortKey);
    long total = queryMapper.countReservations();

    if (headers.isEmpty()) {
      return ReservationListView.empty(page, size, total, "/reservations?page=" + page + "&size=" + size);
    }

    List<Integer> ids = headers.stream().map(ReservationHeaderRow::reservationId).toList();
    var ticketRows = queryMapper.selectTicketsWithOperationByReservationIds(ids);

    return ReservationListAssembler.assemble(headers, ticketRows, page, size, total);
  }
}
