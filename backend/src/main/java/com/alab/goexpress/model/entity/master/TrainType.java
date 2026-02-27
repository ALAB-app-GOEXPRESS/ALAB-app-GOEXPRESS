package com.alab.goexpress.model.entity.master;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "M_TRAIN_TYPE")
@Getter
@NoArgsConstructor
public class TrainType {

  @Id
  @Column(name = "train_type_cd", length = 2)
  private String trainTypeCd;

  @Column(name = "train_type_name", nullable = false)
  private String trainTypeName;
}
