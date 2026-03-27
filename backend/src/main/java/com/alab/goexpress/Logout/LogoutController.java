package com.alab.goexpress.Logout;

import jakarta.servlet.http.HttpServletResponse; // import を変更
import java.io.IOException; // import を追加
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogoutController {

    @Value("${spring.security.oauth2.client.provider.cognito.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.client.registration.cognito.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.provider.cognito.logout-uri}")
    private String logoutUri;

    /**
     * Cognitoのログアウトページにリダイレクトさせるエンドポイント
     * @param response リダイレクトを指示するために使用
     * @throws IOException sendRedirectがスローする可能性
     */
    @GetMapping("/api/logout") // エンドポイント名を変更
    public void handleLogout(HttpServletResponse response) throws IOException {
        String cognitoDomain = this.issuerUri.replace("https://", "").split("/")[0];

        String logoutUrl = String.format(
            "https://%s/logout?client_id=%s&logout_uri=%s",
            cognitoDomain,
            this.clientId,
            URLEncoder.encode(this.logoutUri, StandardCharsets.UTF_8)
        );

        // ブラウザに「このURLにリダイレクトしなさい」と命令します
        response.sendRedirect(logoutUrl);
    }
}
 