package com.alab.goexpress;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
  properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration"
  }
)
class GoexpressApplicationTests {

  @Test
  void contextLoads() {}
}
