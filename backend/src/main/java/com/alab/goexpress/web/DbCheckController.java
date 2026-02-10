package com.alab.goexpress.web;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbCheckController {

    private final JdbcTemplate jdbcTemplate;

    public DbCheckController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/dbcheck")
    public String dbcheck() {
        Integer one = jdbcTemplate.queryForObject("select 1", Integer.class);
        return (one != null && one == 1) ? "OK" : "NG";
    }
}