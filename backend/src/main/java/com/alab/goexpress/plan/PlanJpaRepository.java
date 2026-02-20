package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.master.Plan;
import com.alab.goexpress.model.entity.master.PlanId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanJpaRepository extends JpaRepository<Plan, PlanId> {
  List<Plan> findByTrainCd(String trainCd);
}
