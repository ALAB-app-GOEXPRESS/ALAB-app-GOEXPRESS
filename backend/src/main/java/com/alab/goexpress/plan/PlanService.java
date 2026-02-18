package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.plan.Plan;
import com.alab.goexpress.model.entity.plan.PlanId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

  private final PlanRepositoryPort planRepo;

  @Transactional
  public Plan create(Plan plan) {
    // 既存があるなら上書きになるので、厳密にやるなら存在チェックを入れる
    return planRepo.save(plan);
  }

  @Transactional(readOnly = true)
  public Plan get(PlanId id) {
    return planRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + id));
  }

  @Transactional
  public Plan update(PlanId id, Plan newValues) {
    Plan current = get(id);
    current.setArrivalTime(newValues.getArrivalTime());
    current.setDepartureTime(newValues.getDepartureTime());
    current.setTrackNumber(newValues.getTrackNumber());
    return planRepo.save(current);
  }

  @Transactional
  public void delete(PlanId id) {
    planRepo.deleteById(id);
  }

  @Transactional(readOnly = true)
  public List<Plan> listByTrainCd(String trainCd) {
    return planRepo.findByTrainCd(trainCd);
  }
}
