package com.alab.goexpress.train;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.model.dto.SeatTypeInfoDTO;
import com.alab.goexpress.model.dto.TrainInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainService {

  private final TrainMapper mapper;

  @Transactional(readOnly = true)
  public List<TrainResponse> find(String fromStationCd, String toStationCd) {
    return mapper.selectTrains(fromStationCd, toStationCd);
  }

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
    TrainInfoDTO trainInfo = mapper.findTrainInfo(trainCd);
    if (trainInfo == null) {
      throw new RuntimeException("Train not found: " + trainCd);
    }

    DepartureInfo departureInfo = mapper.findDepartureInfo(trainCd, fromStationCd);
    if (departureInfo == null) {
      throw new RuntimeException("Departure info not found");
    }

    LocalTime arrivalTime = mapper.findArrivalTime(trainCd, toStationCd);
    if (arrivalTime == null) {
      throw new RuntimeException("Arrival time not found");
    }

    List<SeatTypeInfoDTO> seatTypes = mapper.findSeatTypesForTrain(trainCd);

    List<TrainDetailResponse.SeatClassInfo> seatClassInfos = seatTypes
      .stream()
      .map(seatType -> {
        String trainTypeCd = mapper.findTrainTypeCd(trainCd);

        Integer chargeResult = mapper.findCharge(
          fromStationCd,
          toStationCd,
          trainTypeCd,
          seatType.getSeatTypeCd()
        );
        int charge = (chargeResult != null) ? chargeResult : 0;

        Long maxSeats = mapper.sumMaxSeatNumber(trainCd, seatType.getSeatTypeCd());
        if (maxSeats == null) {
          maxSeats = 0L;
        }

        long reservedSeats = mapper.countReservedSeatsBySeatType(trainCd, date, seatType.getSeatTypeCd());

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
      trainCd,
      trainInfo.getTrainTypeName(),
      trainInfo.getTrainNumber(),
      fromStationCd,
      toStationCd,
      departureInfo.departureTime(),
      arrivalTime,
      departureInfo.trackNumber(),
      seatClassInfos
    );
  }
}
