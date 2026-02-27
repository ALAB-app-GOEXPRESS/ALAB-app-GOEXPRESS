package com.alab.goexpress.traindetail;

import com.alab.goexpress.master.SeatTypeInfoDTO;
import com.alab.goexpress.master.charge.ChargeMasterJpaRepository;
import com.alab.goexpress.master.plan.PlanMasterJpaRepository;
import com.alab.goexpress.master.train.TrainCarMasterJpaRepository;
import com.alab.goexpress.master.train.TrainMasterJpaRepository;
import com.alab.goexpress.model.entity.master.Train;
import com.alab.goexpress.model.response.TrainDetailResponse;
import com.alab.goexpress.seat.SeatReservationJpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainDetailService {

  private final TrainMasterJpaRepository trainMasterRepository;
  private final PlanMasterJpaRepository planMasterRepository;
  private final TrainCarMasterJpaRepository trainCarMasterRepository;
  private final ChargeMasterJpaRepository chargeMasterRepository;
  private final SeatReservationJpaRepository seatReservationRepository;

  /**
   * 列車詳細情報を取得するビジネスロジック
   *
   * @param date 出発日
   * @param trainCd 列車コード
   * @param fromStationCd 出発駅コード
   * @param toStationCd 到着駅コード
   * @return 画面表示用の列車詳細情報
   */
  @Transactional(readOnly = true)
  public TrainDetailResponse getTrainDetail(LocalDate date, String trainCd, String fromStationCd, String toStationCd) {
    Train train = trainMasterRepository
      .findById(trainCd)
      .orElseThrow(() -> new RuntimeException("Train not found: " + trainCd));

    PlanMasterJpaRepository.DepartureInfoView departureInfo = planMasterRepository
      .findDepartureInfo(trainCd, fromStationCd)
      .orElseThrow(() -> new RuntimeException("Departure info not found"));

    LocalTime arrivalTime = planMasterRepository
      .findArrivalTime(trainCd, toStationCd)
      .orElseThrow(() -> new RuntimeException("Arrival time not found"));

    List<SeatTypeInfoDTO> seatTypes = trainCarMasterRepository.findSeatTypesForTrain(trainCd);

    List<TrainDetailResponse.SeatClassInfo> seatClassInfos = seatTypes
      .stream()
      .map(seatType -> {
        int charge = chargeMasterRepository
          .findCharge(fromStationCd, toStationCd, train.getTrainTypeCd(), seatType.getSeatTypeCd())
          .orElse(0);

        Long maxSeats = trainCarMasterRepository.sumMaxSeatNumber(trainCd, seatType.getSeatTypeCd());
        if (maxSeats == null) {
          maxSeats = 0L;
        }

        long reservedSeats = seatReservationRepository.countReservedSeatsBySeatType(
          trainCd,
          date,
          seatType.getSeatTypeCd()
        );

        int remainingSeats = (int) (maxSeats - reservedSeats);

        return new TrainDetailResponse.SeatClassInfo(
          seatType.getSeatTypeCd(),
          seatType.getSeatTypeName(),
          charge,
          remainingSeats
        );
      })
      .collect(Collectors.toList());

    return new TrainDetailResponse(
      train.getTrainCd(),
      train.getTrainType().getTrainTypeName(),
      train.getTrainNumber(),
      fromStationCd,
      toStationCd,
      departureInfo.getDepartureTime(),
      arrivalTime,
      departureInfo.getTrackNumber(),
      seatClassInfos
    );
  }
}
