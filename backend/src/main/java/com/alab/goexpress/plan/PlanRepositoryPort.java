package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.plan.Plan;
import com.alab.goexpress.model.entity.plan.PlanId;
import java.util.List;
import java.util.Optional;

public interface PlanRepositoryPort {
  Plan save(Plan plan);

  Optional<Plan> findById(PlanId id);

  boolean existsById(PlanId id);

  void deleteById(PlanId id);

  List<Plan> findByTrainCd(String trainCd);
}
