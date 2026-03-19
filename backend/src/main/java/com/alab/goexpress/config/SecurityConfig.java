package com.alab.goexpress.config;

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
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.alab.goexpress.account.AccountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private AccountService accountService;

  @Value("${auth.origin-uri}")
  private String originUri;

  @Bean
  // CORSの設定を行うメソッド
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 許可するオリジン（フロントエンドのURL）を指定
    configuration.setAllowedOrigins(Arrays.asList(originUri));

    // 許可するHTTPメソッドを指定（GET, POST, PUT, DELETE, OPTIONSを許可）
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

    // 許可するヘッダ情報を指定（authorizationとcontent-typeを許可）
    configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type"));

    // CORSの設定情報をURLベースで登録するためのオブジェクトを作成
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    // 全てのパスに対してCORSの設定を登録
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // CSRF対策の設定
    http
      .csrf(Customizer.withDefaults())
      //未ログイン時でも予約可能にするため、予約時はCSRF対策を無視
      .csrf(csrf -> csrf.ignoringRequestMatchers("/api/reservations"))
      // CORSの設定を適用
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      // セッションをサーバ側で保持しない（ステートレス）ように設定
      .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      // HTTPリクエストの認可設定
      .authorizeHttpRequests(authorize ->
        authorize
          // OPTIONSメソッド（事前リクエスト）の全てのパスへのアクセスを認証なしで許可
          .requestMatchers(HttpMethod.OPTIONS, "/**")
          .permitAll()
          // 上記以外のリクエストは認証を必要とする設定
          .anyRequest()
          // .authenticated()
          .permitAll()
      )
      // OAuth2ログインの設定で、ログイン成功時の処理を指定
      .oauth2Login(oauth2 -> oauth2.successHandler(this::handleOAuth2LoginSuccess))
      // AuthorizationヘッダのJWTを検証する設定
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
    return http.build();
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

      String redirect =
        originUri +
        "/login/callback" +
        "#id_token=" +
        URLEncoder.encode(idToken, StandardCharsets.UTF_8) +
        "&user_id=" +
        userId +
        "&user_name=" +
        userName;

      response.setStatus(HttpServletResponse.SC_FOUND);
      response.setHeader("Location", redirect);
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.getWriter().write("{\"error\": \"Authentication failed\"}");
    }
  }
}
