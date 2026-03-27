package com.alab.goexpress.config;

import com.alab.goexpress.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private AccountService accountService;

  @Value("${auth.origin-uri}")
  private String originUri;

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(originUri));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(Customizer.withDefaults())
      .csrf(csrf -> csrf.ignoringRequestMatchers("/api/reservations"))
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
      // /logout は Controller で処理するため許可
      .authorizeHttpRequests(authorize -> authorize.requestMatchers("/logout").permitAll().anyRequest().permitAll())
      .oauth2Login(oauth2 -> oauth2.successHandler(this::handleOAuth2LoginSuccess))
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    return http.build();
  }

  private String ensureAbsoluteUrl(String uri) {
    if (uri.startsWith("http://") || uri.startsWith("https://")) {
      return uri;
    }
    return "http://" + uri;
  }

  private void handleOAuth2LoginSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
  ) throws IOException {
    try {
      DefaultOidcUser oidcUser = (DefaultOidcUser) authentication.getPrincipal();
      String idToken = oidcUser.getIdToken().getTokenValue();
      String email = (String) oidcUser.getClaims().get("email");
      Integer userId = accountService.findUserByEmailAddres(email).getAccountId();
      String userName = accountService.findUserByEmailAddres(email).getAccountName();

      // フロントは /login/callback なので整合させる
      String base = ensureAbsoluteUrl(originUri);
      String redirect =
        base +
        "/login-callback" +
        "#id_token=" +
        URLEncoder.encode(idToken, StandardCharsets.UTF_8) +
        "&user_id=" +
        userId +
        "&user_name=" +
        URLEncoder.encode(userName, StandardCharsets.UTF_8) +
        "&email=" +
        URLEncoder.encode(email, StandardCharsets.UTF_8);

      response.setStatus(HttpServletResponse.SC_FOUND);
      response.setHeader("Location", redirect);
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.getWriter().write("{\"error\": \"Authentication failed\"}");
    }
  }
}
