package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.plan.Plan;
import com.alab.goexpress.model.entity.plan.PlanId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PlanRepositoryImpl implements PlanRepositoryPort {

  private final PlanJpaRepository jpa;

  @Override
  public Plan save(Plan plan) {
    return jpa.save(plan);
  }

  @Override
  public Optional<Plan> findById(PlanId id) {
    return jpa.findById(id);
  }

  @Override
  public boolean existsById(PlanId id) {
    return jpa.existsById(id);
  }

  @Override
  public void deleteById(PlanId id) {
    jpa.deleteById(id);
  }

  @Override
  public List<Plan> findByTrainCd(String trainCd) {
    return jpa.findByTrainCd(trainCd);
  }
}
