package com.alab.goexpress;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.alab.goexpress.repository")
public class GoexpressApplication {

  public static void main(String[] args) {
    SpringApplication.run(GoexpressApplication.class, args);
  }
}
