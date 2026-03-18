package com.alab.goexpress.train.dto;

import java.time.LocalDate;
import java.util.List;

public record TrainDetailResponse(TrainDto trainBasicInfo, String trackNumber, List<SeatClassDto> seatClasses, LocalDate date) {}
