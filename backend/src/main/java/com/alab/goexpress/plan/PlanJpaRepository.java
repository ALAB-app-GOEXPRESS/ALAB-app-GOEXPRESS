package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.plan.Plan;
import com.alab.goexpress.model.entity.plan.PlanId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanJpaRepository extends JpaRepository<Plan, PlanId> {
  List<Plan> findByTrainCd(String trainCd);
}
