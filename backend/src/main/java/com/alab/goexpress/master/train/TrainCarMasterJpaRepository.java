package com.alab.goexpress.master.train;

import com.alab.goexpress.master.SeatTypeInfoDTO;
import com.alab.goexpress.model.entity.master.TrainCar;
import com.alab.goexpress.model.entity.master.TrainCarId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * M_TRAIN_CAR 参照用（Seat選択で使用）
 */
public interface TrainCarMasterJpaRepository extends JpaRepository<TrainCar, TrainCarId> {
  // seat_type_cd で絞り、車両番号順に取得
  List<TrainCar> findByTrainCdAndSeatTypeCdOrderByTrainCarCdAsc(String trainCd, String seatTypeCd);

  @Query(
    """
    SELECT DISTINCT new com.alab.goexpress.master.SeatTypeInfoDTO(st.seatTypeCd, st.seatName)
    FROM TrainCar tc JOIN tc.seatType st WHERE tc.trainCd = :trainCd ORDER BY st.seatTypeCd ASC
    """
  )
  List<SeatTypeInfoDTO> findSeatTypesForTrain(@Param("trainCd") String trainCd);

  @Query(
    """
    SELECT SUM(tc.maxSeatNumber)
    FROM TrainCar tc WHERE tc.trainCd = :trainCd AND tc.seatTypeCd = :seatTypeCd
    """
  )
  Long sumMaxSeatNumber(@Param("trainCd") String trainCd, @Param("seatTypeCd") String seatTypeCd);
}
