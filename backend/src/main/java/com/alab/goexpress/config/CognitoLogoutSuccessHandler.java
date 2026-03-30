package com.alab.goexpress.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistration.ProviderDetails;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * A logout success handler for initiating OIDC logout through the user agent.
 *
 * @author Josh Cummings
 * @since 5.2
 * @see <a href=
 * "https://openid.net/specs/openid-connect-rpinitiated-1_0.html">RP-Initiated Logout</a>
 * @see org.springframework.security.web.authentication.logout.LogoutSuccessHandler
 */
public class CognitoLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {

  private final ClientRegistrationRepository clientRegistrationRepository;

  private @Nullable String postLogoutRedirectUri;

  public CognitoLogoutSuccessHandler(ClientRegistrationRepository clientRegistrationRepository) {
    Assert.notNull(clientRegistrationRepository, "clientRegistrationRepository cannot be null");
    this.clientRegistrationRepository = clientRegistrationRepository;
    this.postLogoutRedirectUri = null;
  }

  @Override
  protected String determineTargetUrl(
    HttpServletRequest request,
    HttpServletResponse response,
    @Nullable Authentication authentication
  ) {
    String targetUrl = null;
    if (authentication instanceof OAuth2AuthenticationToken && authentication.getPrincipal() instanceof OidcUser) {
      String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
      ClientRegistration clientRegistration = this.clientRegistrationRepository.findByRegistrationId(registrationId);
      if (clientRegistration != null) {
        URI endSessionEndpoint = this.endSessionEndpoint(clientRegistration);
        if (endSessionEndpoint != null) {
          String postLogoutRedirectUri = postLogoutRedirectUri(request, clientRegistration);
          targetUrl = endpointUri(endSessionEndpoint, clientRegistration, postLogoutRedirectUri);
        }
      }
    }
    return (targetUrl != null) ? targetUrl : super.determineTargetUrl(request, response, authentication);
  }

  private @Nullable URI endSessionEndpoint(@Nullable ClientRegistration clientRegistration) {
    if (clientRegistration != null) {
      ProviderDetails providerDetails = clientRegistration.getProviderDetails();
      Object endSessionEndpoint = providerDetails.getConfigurationMetadata().get("end_session_endpoint");
      if (endSessionEndpoint != null) {
        return URI.create(endSessionEndpoint.toString());
      }
    }
    return null;
  }

  private @Nullable String postLogoutRedirectUri(
    HttpServletRequest request,
    @Nullable ClientRegistration clientRegistration
  ) {
    if (this.postLogoutRedirectUri == null || clientRegistration == null) {
      return null;
    }
    // @formatter:off
    UriComponents uriComponents = UriComponentsBuilder
				.fromUriString(UrlUtils.buildFullRequestUrl(request))
				.replacePath(request.getContextPath())
				.replaceQuery(null)
				.fragment(null)
				.build();

    Map<String, String> uriVariables = new HashMap<>();
    String scheme = uriComponents.getScheme();
    uriVariables.put("baseScheme", (scheme != null) ? scheme : "");
    uriVariables.put("baseUrl", uriComponents.toUriString());

    String host = uriComponents.getHost();
    uriVariables.put("baseHost", (host != null) ? host : "");

    String path = uriComponents.getPath();
    uriVariables.put("basePath", (path != null) ? path : "");

    int port = uriComponents.getPort();
    uriVariables.put("basePort", (port == -1) ? "" : ":" + port);

    uriVariables.put("registrationId", clientRegistration.getRegistrationId());

    return UriComponentsBuilder.fromUriString(this.postLogoutRedirectUri)
				.buildAndExpand(uriVariables)
				.toUriString();
    // @formatter:on
  }

  private String endpointUri(
    URI endSessionEndpoint,
    ClientRegistration clientRegistration,
    String postLogoutRedirectUri
  ) {
    UriComponentsBuilder builder = UriComponentsBuilder.fromUri(endSessionEndpoint);
    builder.queryParam("client_id", clientRegistration.getClientId());
    if (postLogoutRedirectUri != null) {
      builder.queryParam("logout_uri", postLogoutRedirectUri);
    }
    return builder.encode(StandardCharsets.UTF_8).build().toUriString();
  }

  /**
   * Set the post logout redirect uri template.
   *
   * <br />
   * The supported uri template variables are: {@code {baseScheme}}, {@code {baseHost}},
   * {@code {basePort}} and {@code {basePath}}.
   *
   * <br />
   * <b>NOTE:</b> {@code "{baseUrl}"} is also supported, which is the same as
   * {@code "{baseScheme}://{baseHost}{basePort}{basePath}"}
   *
   * <pre>
   * 	handler.setPostLogoutRedirectUri("{baseUrl}");
   * </pre>
   *
   * will make so that {@code post_logout_redirect_uri} will be set to the base url for
   * the client application.
   * @param postLogoutRedirectUri - A template for creating the
   * {@code post_logout_redirect_uri} query parameter
   * @since 5.3
   */
  public void setPostLogoutRedirectUri(String postLogoutRedirectUri) {
    Assert.notNull(postLogoutRedirectUri, "postLogoutRedirectUri cannot be null");
    this.postLogoutRedirectUri = postLogoutRedirectUri;
  }
}
