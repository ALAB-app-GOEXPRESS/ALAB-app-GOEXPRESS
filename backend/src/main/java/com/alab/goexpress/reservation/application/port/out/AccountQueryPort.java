package com.alab.goexpress.reservation.application.port.out;

import com.alab.goexpress.reservation.application.port.out.model.BuyerAccount;

public interface AccountQueryPort {
  BuyerAccount getDefaultBuyerAccount();
}
