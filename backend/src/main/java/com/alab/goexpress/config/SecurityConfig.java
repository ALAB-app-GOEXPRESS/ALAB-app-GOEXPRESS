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
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

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
  public SecurityFilterChain filterChain(
    HttpSecurity http,
    ClientRegistrationRepository clientRegistrationRepository,
    HandlerMappingIntrospector introspector
  ) throws Exception {
    // AntPathRequestMatcher の代替：MvcRequestMatcher を使用（GET /logout を許可）
    MvcRequestMatcher logoutMatcher = new MvcRequestMatcher(introspector, "/logout");
    logoutMatcher.setMethod(HttpMethod.GET);

    http
      .csrf(Customizer.withDefaults())
      // 未ログインでも予約可能にするため、予約時は CSRF 対策を無視
      .csrf(csrf -> csrf.ignoringRequestMatchers("/api/reservations"))
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      // OIDC ログイン/ログアウト時のみサーバセッションを使用
      .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
      // 本実装では全て許可（必要に応じてパス単位で制限を検討）
      .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
      // OAuth2 ログイン成功時の挙動
      .oauth2Login(oauth2 -> oauth2.successHandler(this::handleOAuth2LoginSuccess))
      // OIDC ログアウト（RP-initiated logout）
      .logout(logout ->
        logout
          .logoutRequestMatcher(logoutMatcher)
          .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository))
          .invalidateHttpSession(true)
          .clearAuthentication(true)
      )
      // リソースサーバ（JWT 検証）
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    return http.build();
  }

  private OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler(
    ClientRegistrationRepository clientRegistrationRepository
  ) {
    OidcClientInitiatedLogoutSuccessHandler handler = new OidcClientInitiatedLogoutSuccessHandler(
      clientRegistrationRepository
    );
    // ログアウト後の戻り先（フロントのログイン画面など）
    handler.setPostLogoutRedirectUri(originUri + "/search");
    return handler;
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

      // フロントのルーティングに合わせる（router.tsx は 'login/callback'）
      String redirect =
        originUri +
        "/login-callback" +
        "#id_token=" +
        URLEncoder.encode(idToken, StandardCharsets.UTF_8) +
        "&user_id=" +
        userId +
        "&user_name=" +
        userName +
        "&email=" +
        email;

      response.setStatus(HttpServletResponse.SC_FOUND);
      response.setHeader("Location", redirect);
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.getWriter().write("{\"error\": \"Authentication failed\"}");
    }
  }
}
