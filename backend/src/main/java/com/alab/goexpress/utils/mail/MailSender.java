package com.alab.goexpress.utils.mail;

public interface MailSender {
  void sendText(String to, String subject, String body);
  void sendHtml(String to, String subject, String htmlBody);
}
