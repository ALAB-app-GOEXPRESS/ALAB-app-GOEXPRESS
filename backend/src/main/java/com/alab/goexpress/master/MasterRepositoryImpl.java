package com.alab.goexpress.master;

import com.alab.goexpress.master.charge.ChargeMasterJpaRepository;
import com.alab.goexpress.master.plan.PlanMasterJpaRepository;
import com.alab.goexpress.master.train.TrainCarMasterJpaRepository;
import com.alab.goexpress.master.train.TrainMasterJpaRepository;
import com.alab.goexpress.seat.SeatReservationJpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MasterRepositoryImpl implements MasterRepositoryPort {

  private final TrainMasterJpaRepository trainJpaRepository;
  private final PlanMasterJpaRepository planJpaRepository;
  private final ChargeMasterJpaRepository chargeJpaRepository;
  private final TrainCarMasterJpaRepository trainCarMasterJpaRepository;
  private final SeatReservationJpaRepository seatReservationJpaRepository;

  @Override
  public String getTrainTypeCd(String trainCd) {
    return trainJpaRepository
      .findTrainTypeCd(trainCd)
      .orElseThrow(() -> new IllegalArgumentException("train not found: " + trainCd));
  }

  @Override
  public DepartureInfo getDepartureInfo(String trainCd, String stationCd) {
    var view = planJpaRepository
      .findDepartureInfo(trainCd, stationCd)
      .orElseThrow(() ->
        new IllegalArgumentException("plan (departure) not found: train=" + trainCd + ", station=" + stationCd)
      );
    return new DepartureInfo(view.getDepartureTime(), view.getTrackNumber());
  }

  @Override
  public LocalTime getArrivalTime(String trainCd, String stationCd) {
    return planJpaRepository
      .findArrivalTime(trainCd, stationCd)
      .orElseThrow(() ->
        new IllegalArgumentException("plan (arrival) not found: train=" + trainCd + ", station=" + stationCd)
      );
  }

  @Override
  public int getCharge(String depSt, String arrSt, String trainTypeCd, String seatTypeCd) {
    return chargeJpaRepository.findCharge(depSt, arrSt, trainTypeCd, seatTypeCd).orElse(0);
  }

  @Override
  public TrainInfoDTO getTrainInfo(String trainCd) {
    return trainJpaRepository
      .findTrainInfo(trainCd)
      .orElseThrow(() -> new IllegalArgumentException("train info not found: " + trainCd));
  }

  @Override
  public Long sumMaxSeatNumber(String trainCd, String seatTypeCd) {
    return trainCarMasterJpaRepository.sumMaxSeatNumber(trainCd, seatTypeCd);
  }

  @Override
  public long countReservedSeatsBySeatType(String trainCd, LocalDate date, String seatTypeCd) {
    return seatReservationJpaRepository.countReservedSeatsBySeatType(trainCd, date, seatTypeCd);
  }
}
