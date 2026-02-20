package com.alab.goexpress.master.train;

import com.alab.goexpress.model.entity.master.TrainCar;
import com.alab.goexpress.model.entity.master.TrainCarId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * M_TRAIN_CAR 参照用（Seat選択で使用）
 */
public interface TrainCarMasterJpaRepository extends JpaRepository<TrainCar, TrainCarId> {

  // seat_type_cd で絞り、車両番号順に取得
  List<TrainCar> findByTrainCdAndSeatTypeCdOrderByTrainCarCdAsc(String trainCd, String seatTypeCd);
}
