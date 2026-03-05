package com.alab.goexpress.train.dto;

import java.util.List;

public record TrainDetailResponse(TrainDto trainBasicInfo, String trackNumber, List<SeatClassDto> seatClasses) {}
