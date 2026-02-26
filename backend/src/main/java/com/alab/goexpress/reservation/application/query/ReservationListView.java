package com.alab.goexpress.reservation.application.query;

import java.util.List;

public record ReservationListView(List<ReservationListItemView> items, PageView page, LinksView links) {
  public static ReservationListView empty(int page, int size, long total, String self) {
    return new ReservationListView(List.of(), new PageView(page, size, total), new LinksView(self, null));
  }
}
