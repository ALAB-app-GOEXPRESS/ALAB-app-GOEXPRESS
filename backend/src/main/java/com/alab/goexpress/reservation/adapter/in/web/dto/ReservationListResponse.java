package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.util.List;

public record ReservationListResponse(List<ReservationListItemDto> items, PageDto page, LinksDto _links) {
  public static ReservationListResponse empty(int page, int size, long total, String self) {
    return new ReservationListResponse(List.of(), new PageDto(page, size, total), new LinksDto(self, null));
  }
}
