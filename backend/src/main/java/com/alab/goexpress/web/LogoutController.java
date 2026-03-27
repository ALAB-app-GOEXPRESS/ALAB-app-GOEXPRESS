package com.alab.goexpress.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LogoutController {

  private final ClientRegistrationRepository clientRegistrationRepository;

  @Value("${auth.origin-uri}")
  private String originUri;

  public LogoutController(ClientRegistrationRepository clientRegistrationRepository) {
    this.clientRegistrationRepository = clientRegistrationRepository;
  }

  @GetMapping("/logout")
  public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
    throws IOException {
    // サーバ側のセッション/認証情報をクリア
    new SecurityContextLogoutHandler().logout(request, response, authentication);

    String regId = (authentication instanceof OAuth2AuthenticationToken t)
      ? t.getAuthorizedClientRegistrationId()
      : null;
    ClientRegistration reg = (regId != null) ? clientRegistrationRepository.findByRegistrationId(regId) : null;

    if (reg != null) {
      // 例: https://{domain}.auth.{region}.amazoncognito.com/oauth2/authorize → base を導出
      String authorizeUri = reg.getProviderDetails().getAuthorizationUri();
      String base = authorizeUri.replace("/oauth2/authorize", "");
      String cognitoLogoutEndpoint = base + "/logout";

      String clientId = reg.getClientId();
      String redirectAfterLogout = ensureAbsoluteUrl(originUri) + "/search"; // 必ず Cognito の「Sign out URL(s)」に登録

      String url =
        cognitoLogoutEndpoint +
        "?client_id=" +
        URLEncoder.encode(clientId, StandardCharsets.UTF_8) +
        "&logout_uri=" +
        URLEncoder.encode(redirectAfterLogout, StandardCharsets.UTF_8);

      response.sendRedirect(url);
      return;
    }

    // フォールバック（未ログイン/非OIDC）
    response.sendRedirect(ensureAbsoluteUrl(originUri) + "/login");
  }

  private String ensureAbsoluteUrl(String uri) {
    if (uri.startsWith("http://") || uri.startsWith("https://")) {
      return uri;
    }
    return "http://" + uri;
  }
}
