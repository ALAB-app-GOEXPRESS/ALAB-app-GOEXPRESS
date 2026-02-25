package com.alab.goexpress.master.train;

import com.alab.goexpress.master.TrainInfoDTO;
import com.alab.goexpress.model.entity.master.Train;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * M_TRAIN に対する参照用リポジトリ
 */
public interface TrainMasterJpaRepository extends JpaRepository<Train, String> {
  @Query("select t.trainTypeCd from Train t where t.trainCd = :trainCd")
  Optional<String> findTrainTypeCd(@Param("trainCd") String trainCd);

  @Query(
    """ SELECT new com.alab.goexpress.master.TrainInfoDTO(tt.trainTypeName, t.trainNumber, t.trainTypeCd) FROM Train t JOIN t.trainType tt WHERE t.trainCd = :trainCd """
  )
  Optional<TrainInfoDTO> findTrainInfo(@Param("trainCd") String trainCd);
}
