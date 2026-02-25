package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.util.Set;

public class SortUtil {

  public static String normalize(String sort, Set<String> allowedKeys) {
    if (sort == null || sort.isBlank()) return "buyDatetime,desc";
    String[] parts = sort.split(",");
    String key = parts[0].trim();
    String dir = (parts.length > 1 ? parts[1].trim() : "desc").toLowerCase();

    if (!allowedKeys.contains(key)) key = "buyDatetime";
    if (!dir.equals("asc") && !dir.equals("desc")) dir = "desc";

    return key + "," + dir;
  }
}
