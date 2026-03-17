package com.alab.goexpress.config;

import com.alab.goexpress.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
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

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private AccountService accountService;

  @Bean
  // CORSの設定を行うメソッド
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 許可するオリジン（フロントエンドのURL）を指定
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

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
      // CORSの設定を適用
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      // セッションをサーバ側で保持しない（ステートレス）ように設定
      .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      // HTTPリクエストの認可設定
      .authorizeHttpRequests(authorize ->
        authorize
          // /auth/で始まるURLへのアクセスを認証なしで許可
          .requestMatchers("/auth/**")
          .permitAll()
          // OPTIONSメソッド（事前リクエスト）の全てのパスへのアクセスを認証なしで許可
          .requestMatchers(HttpMethod.OPTIONS, "/**")
          .permitAll()
          // 上記以外のリクエストは認証を必要とする設定
          .anyRequest()
          .authenticated()
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
      // 認証に成功したユーザ情報を取得
      DefaultOidcUser oidcUser = (DefaultOidcUser) authentication.getPrincipal();

      // ユーザのIDトークンを取得
      String idToken = oidcUser.getIdToken().getTokenValue();

      // クレーム（ユーザ属性）情報を取得
      // 基本的にはIDトークンから取得される
      // 利用可能な場合、userInfoエンドポイントにもアクセスして追加の情報を取得する
      Map<String, Object> attributes = oidcUser.getClaims();

      // クレーム情報から名前とメールアドレスを取得
      String username = (String) attributes.get("name");
      String email = (String) attributes.get("email");

      // ユーザ情報を業務DBに保存し、ユーザIDを取得
      Integer userId = accountService.findUserByEmailAddres(email).getAccountId();

      // レスポンスをJSON形式で書き込む
      writeJsonResponse(response, idToken, userId);

      // HTTPステータスコードを200 OKに設定
      response.setStatus(HttpServletResponse.SC_OK);
    } catch (Exception e) {
      // エラーハンドリング：認証処理が失敗した場合、エラーメッセージをレスポンスとして返却する
      // ※本来は例外発生箇所に応じてエラー処理を分けるべきですが、今回は本質ではないため、簡易的なエラーハンドリングを実装しています
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.getWriter().write("{\"error\": \"Authentication failed\"}");
    }
  }

  private void writeJsonResponse(HttpServletResponse response, String idToken, Integer userId) throws IOException {
    // レスポンスのContent-TypeをJSONに設定
    response.setContentType("application/json");

    // レスポンスの文字エンコーディングをUTF-8に設定
    response.setCharacterEncoding("UTF-8");

    // IDトークンとユーザIDをJSON形式の文字列に変換して書き込む
    String jsonResponse = String.format("{\"idToken\": \"%s\", \"userId\": %d}", idToken, userId);
    response.getWriter().write(jsonResponse);
  }
}
