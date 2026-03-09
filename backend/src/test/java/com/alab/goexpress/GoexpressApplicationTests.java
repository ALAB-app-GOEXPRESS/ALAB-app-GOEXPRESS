package com.alab.goexpress;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.alab.goexpress.master.train.TrainMasterJpaRepository;
import com.alab.goexpress.master.plan.PlanMasterJpaRepository;
import com.alab.goexpress.master.charge.ChargeMasterJpaRepository;
import com.alab.goexpress.master.train.TrainCarMasterJpaRepository;
import com.alab.goexpress.seat.SeatReservationJpaRepository;

@SpringBootTest(
  properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration"
  }
)
class GoexpressApplicationTests {

  // コンテキスト起動時に必要な依存をモックして、DBやJPA設定なしでも起動可能にする
  @MockBean
  TrainMasterJpaRepository trainMasterJpaRepository;

  @MockBean
  PlanMasterJpaRepository planMasterJpaRepository;

  @MockBean
  ChargeMasterJpaRepository chargeMasterJpaRepository;

  @MockBean
  TrainCarMasterJpaRepository trainCarMasterJpaRepository;

  @MockBean
  SeatReservationJpaRepository seatReservationJpaRepository;

  @Test
  void contextLoads() {}
}
