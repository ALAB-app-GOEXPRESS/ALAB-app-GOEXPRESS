package com.alab.goexpress.reservation.dto;

import java.util.List;

public record ReservationListResponse(List<ReservationItemDto> items, PageDto page, LinksDto _links) {}
