package com.alab.goexpress.train;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.train.dto.SeatTypeInfoDTO;
import com.alab.goexpress.train.dto.SeatClassDto;
import com.alab.goexpress.train.dto.TrainDetailResponse;
import com.alab.goexpress.train.dto.TrainDto;
import com.alab.goexpress.train.dto.SeatAvailabilityDto;
import com.alab.goexpress.train.dto.TrainSearchResultDto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

  private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

  @Transactional(readOnly = true)
  public List<TrainSearchResultDto> find(String fromStationCd, String toStationCd, LocalDate date, LocalTime time) {
    List<TrainDto> allTrains = mapper.selectTrainList(fromStationCd, toStationCd);

    List<TrainSearchResultDto> results = allTrains.stream()
      .map(train -> {
        DepartureInfo departureInfo = mapper.findDepartureInfo(train.trainCd(), fromStationCd);
        String trackNumber = (departureInfo != null) ? departureInfo.trackNumber() : "";

        // ▼▼▼ ここをデータベースの情報に合わせて修正しました！ ▼▼▼
        int reservedSeats = calculateRemainingSeats(train.trainCd(), date, "10"); // 指定席
        int greenSeats = calculateRemainingSeats(train.trainCd(), date, "20");    // グリーン車
        int grandclassSeats = calculateRemainingSeats(train.trainCd(), date, "30"); // グランクラス

        SeatAvailabilityDto seatAvailability = new SeatAvailabilityDto(reservedSeats, greenSeats, grandclassSeats);

        return new TrainSearchResultDto(
          train.trainCd(),
          train.trainTypeName(),
          train.trainNumber(),
          train.departureTime().format(TIME_FORMATTER),
          train.arrivalTime().format(TIME_FORMATTER),
          train.fromStationCd(),
          train.toStationCd(),
          trackNumber,
          seatAvailability
        );
      })
      .collect(Collectors.toList());

    final LocalTime boundary = LocalTime.of(6, 0);
    return results.stream()
      .sorted(Comparator.comparing(
          (TrainSearchResultDto train) -> LocalTime.parse(train.departureTime()).isBefore(boundary)
        ).thenComparing(TrainSearchResultDto::departureTime))
      .collect(Collectors.toList());
  }

  /**
   * 空席数を計算するためのヘルパーメソッド
   */
  private int calculateRemainingSeats(String trainCd, LocalDate date, String seatTypeCd) {
    Long maxSeatsResult = mapper.sumMaxSeatNumber(trainCd, seatTypeCd);
    long maxSeats = (maxSeatsResult != null) ? maxSeatsResult : 0L;

    if (maxSeats == 0) {
      return 0;
    }

    long reservedSeats = mapper.countReservedSeatsBySeatType(trainCd, date, seatTypeCd);
    int remainingSeats = (int) (maxSeats - reservedSeats);

    return Math.max(0, remainingSeats);
  }

  /**
   * 列車詳細情報を取得するビジネスロジック
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

        // ★ こちらも共通のヘルパーメソッドを使うように修正
        int remainingSeats = calculateRemainingSeats(trainCd, date, seatType.getSeatTypeCd());

        return new SeatClassDto(seatType.getSeatTypeCd(), seatType.getSeatTypeName(), charge, remainingSeats);
      })
      .toList();

    return new TrainDetailResponse(trainBasicInfo, departureInfo.trackNumber(), seatClasses, date);
  }
}
 