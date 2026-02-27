package com.alab.goexpress.model.entity.master;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "M_TRAIN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

  @Id
  @Column(name = "train_cd", length = 5)
  private String trainCd;

  @Column(name = "train_type_cd", nullable = false, length = 2)
  private String trainTypeCd;

  @Column(name = "train_number", nullable = false, length = 4)
  private String trainNumber;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "train_type_cd", insertable = false, updatable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private TrainType trainType;
}
