package com.alab.goexpress.train.dto;

/**
 * 座席クラスごとの詳細情報を格納する内部クラス
 */
public record SeatClassDto(String seatTypeCd, String seatTypeName, int charge, int remainingSeats) {}
