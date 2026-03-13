package com.alab.goexpress.reservation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.alab.goexpress.utils.mail.MailSender;

@RequiredArgsConstructor
@Service
public class ReservationMailService {
  private final MailSender mailSender;

  public void MailWriter(String buyerName, String emailAddress) {
    String MailBody =
    buyerName+ "様、" + System.lineSeparator()
    + "GO EXPRESSでチケットをご予約いただきありがとうございます。" + System.lineSeparator()
    + "購入が完了しましたので以下よりご確認ください。" + System.lineSeparator()
    + System.lineSeparator()
    + "【チケット情報】" + System.lineSeparator()
    + "https://d1c4321slgqvoi.cloudfront.net/reservation-list";

   mailSender.sendText(emailAddress, "【GO EXPRESS】予約内容のご確認", MailBody);
  };
}
