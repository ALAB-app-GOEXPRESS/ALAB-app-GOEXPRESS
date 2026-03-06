package com.alab.goexpress.reservation.application.port.out.model;

import java.time.LocalTime;

public record DepartureStationInfo(LocalTime departureTime, String trackNumber) {}
