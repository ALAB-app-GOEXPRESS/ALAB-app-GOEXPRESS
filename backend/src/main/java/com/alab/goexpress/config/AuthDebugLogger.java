package com.alab.goexpress.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthDebugLogger {

  private final Environment env;

  public AuthDebugLogger(Environment env) {
    this.env = env;
  }

  @PostConstruct
  public void logAuthProps() {
    String issuer = env.getProperty("auth.issuer-uri");
    String clientId = env.getProperty("auth.clientId");
    String clientSecret = env.getProperty("auth.clientSecret");
    String redirect = env.getProperty("auth.redirect-uri");
    String origin = env.getProperty("auth.origin-uri");

    log.info("[DEBUG-CONFIG] auth.issuer-uri={}", issuer);
    log.info("[DEBUG-CONFIG] auth.redirect-uri={}", redirect);
    log.info("[DEBUG-CONFIG] auth.origin-uri={}", origin);

    // clientId は先頭だけ表示（全部は出さない）
    log.info(
      "[DEBUG-CONFIG] auth.clientId(prefix)={}",
      clientId == null ? null : clientId.substring(0, Math.min(6, clientId.length()))
    );

    // clientSecret は長さだけ（絶対に中身は出さない）
    log.info("[DEBUG-CONFIG] auth.clientSecret(length)={}", clientSecret == null ? null : clientSecret.length());
  }
}
