package com.alab.goexpress.train;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.train.dto.SeatTypeInfoDTO;
import com.alab.goexpress.train.dto.SeatClassDto;
import com.alab.goexpress.train.dto.TrainDetailResponse;
import com.alab.goexpress.train.dto.TrainDto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainService {

  private final TrainMapper mapper;

  @Transactional(readOnly = true)
  public List<TrainDto> find(String fromStationCd, String toStationCd, LocalDate date, LocalTime time) {
    List<TrainDto> allTrains = mapper.selectTrainList(fromStationCd, toStationCd);

    final LocalTime boundary = LocalTime.of(6, 0);

    // 6時を日付の境界とみなし、それより前の時刻はリストの後方に配置するソート
    return allTrains.stream()
      .sorted(Comparator.comparing(
          (TrainDto train) -> train.departureTime().isBefore(boundary)
        ).thenComparing(TrainDto::departureTime))
      .collect(Collectors.toList());
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
    TrainDto trainBasicInfo = mapper.selectTrain(fromStationCd, toStationCd, trainCd);
    if (trainBasicInfo == null) {
      throw new RuntimeException("Train not found: " + trainCd);
    }

    DepartureInfo departureInfo = mapper.findDepartureInfo(trainCd, toStationCd);

    List<SeatTypeInfoDTO> seatTypes = mapper.findSeatTypesForTrain(trainCd);
    List<SeatClassDto> seatClasses = seatTypes
      .stream()
      .map(seatType -> {
        String trainTypeCd = mapper.findTrainTypeCd(trainCd);

        Integer chargeResult = mapper.findCharge(fromStationCd, toStationCd, trainTypeCd, seatType.getSeatTypeCd());
        int charge = (chargeResult != null) ? chargeResult : 0;

        Long maxSeatsResult = mapper.sumMaxSeatNumber(trainCd, seatType.getSeatTypeCd());
        long maxSeats = (maxSeatsResult != null) ? maxSeatsResult : 0L;

        long reservedSeats = mapper.countReservedSeatsBySeatType(trainCd, date, seatType.getSeatTypeCd());

        int remainingSeats = (int) (maxSeats - reservedSeats);

        return new SeatClassDto(seatType.getSeatTypeCd(), seatType.getSeatTypeName(), charge, remainingSeats);
      })
      .toList();

    return new TrainDetailResponse(trainBasicInfo, departureInfo.trackNumber(), seatClasses);
  }
}
