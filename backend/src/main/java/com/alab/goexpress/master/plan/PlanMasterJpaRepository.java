package com.alab.goexpress.master.plan;

import com.alab.goexpress.model.entity.master.Plan;
import com.alab.goexpress.model.entity.master.PlanId;
import java.time.LocalTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * M_PLAN に対する参照用リポジトリ
 */
public interface PlanMasterJpaRepository extends JpaRepository<Plan, PlanId> {

  // 出発情報のプロジェクション
  interface DepartureInfoView {
    LocalTime getDepartureTime();
    String getTrackNumber();
  }

  @Query("""
         select p.departureTime as departureTime, p.trackNumber as trackNumber
         from Plan p
         where p.trainCd = :trainCd and p.arrivalStationCd = :stationCd
         """)
  Optional<DepartureInfoView> findDepartureInfo(
      @Param("trainCd") String trainCd,
      @Param("stationCd") String stationCd);

  @Query("""
         select p.arrivalTime
         from Plan p
         where p.trainCd = :trainCd and p.arrivalStationCd = :stationCd
         """)
  Optional<LocalTime> findArrivalTime(
      @Param("trainCd") String trainCd,
      @Param("stationCd") String stationCd);
}
