package com.alab.goexpress.master.charge;

import com.alab.goexpress.model.entity.master.Charge;
import com.alab.goexpress.model.entity.master.ChargeId;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * M_CHARGE に対する参照用リポジトリ
 */
public interface ChargeMasterJpaRepository extends JpaRepository<Charge, ChargeId> {

  @Query("""
         select c.charge
         from Charge c
         where c.departureStationCd = :dep
           and c.arrivalStationCd = :arr
           and c.trainTypeCd = :type
           and c.seatTypeCd = :seat
         """)
  Optional<Integer> findCharge(
      @Param("dep") String depSt,
      @Param("arr") String arrSt,
      @Param("type") String trainTypeCd,
      @Param("seat") String seatTypeCd);
}
