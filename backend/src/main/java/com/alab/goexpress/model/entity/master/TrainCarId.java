package com.alab.goexpress.model.entity.master;

import java.io.Serializable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TrainCarId implements Serializable {

  private String trainCd;
  private String trainCarCd;
}
