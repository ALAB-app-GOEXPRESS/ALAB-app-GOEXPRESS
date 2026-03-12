package com.alab.goexpress.utils.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.*;

@Service
public class SesMailSender implements MailSender {

  private final SesV2Client sesClient;
  private final String from;

  public SesMailSender(
    SesV2Client sesClient,
    @Value("${ses.from}") String from,
    @Value("${ses.configuration-set:}") String configurationSet
  ) {
    this.sesClient = sesClient;
    this.from = from;
  }

  @Override
  public void sendText(String to, String subject, String body) {
    send(to, subject, body, null);
  }

  @Override
  public void sendHtml(String to, String subject, String htmlBody) {
    send(to, subject, null, htmlBody);
  }

  private void send(String to, String subject, String textBody, String htmlBody) {
    Destination destination = Destination.builder().toAddresses(to).build();

    Content subjectContent = Content.builder().data(subject).charset("UTF-8").build();

    Body.Builder bodyBuilder = Body.builder();
    if (textBody != null) {
      bodyBuilder.text(Content.builder().data(textBody).charset("UTF-8").build());
    }
    if (htmlBody != null) {
      bodyBuilder.html(Content.builder().data(htmlBody).charset("UTF-8").build());
    }

    EmailContent content = EmailContent.builder()
      .simple(Message.builder().subject(subjectContent).body(bodyBuilder.build()).build())
      .build();

    SendEmailRequest.Builder reqBuilder = SendEmailRequest.builder()
      .fromEmailAddress(from)
      .destination(destination)
      .content(content);

    try {
      sesClient.sendEmail(reqBuilder.build());
    } catch (SesV2Exception e) {
      throw new RuntimeException("Failed to send email via SES: " + e.awsErrorDetails().errorMessage(), e);
    }
  }
}
