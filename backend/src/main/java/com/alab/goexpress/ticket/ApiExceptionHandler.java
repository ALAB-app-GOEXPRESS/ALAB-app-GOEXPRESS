package com.alab.goexpress.ticket;

import com.alab.goexpress.web.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e, HttpServletRequest req) {
    ErrorResponse body = new ErrorResponse(
      Instant.now(),
      req.getRequestURI(),
      HttpStatus.BAD_REQUEST.value(),
      "BAD_REQUEST",
      e.getMessage(),
      List.of()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest req) {
    List<String> details = e
      .getBindingResult()
      .getFieldErrors()
      .stream()
      .map(this::formatFieldError)
      .collect(Collectors.toList());

    ErrorResponse body = new ErrorResponse(
      Instant.now(),
      req.getRequestURI(),
      HttpStatus.BAD_REQUEST.value(),
      "VALIDATION_ERROR",
      "入力値が不正です",
      details
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e, HttpServletRequest req) {
    List<String> details = e
      .getConstraintViolations()
      .stream()
      .map(v -> v.getPropertyPath() + ": " + v.getMessage())
      .collect(Collectors.toList());

    ErrorResponse body = new ErrorResponse(
      Instant.now(),
      req.getRequestURI(),
      HttpStatus.BAD_REQUEST.value(),
      "CONSTRAINT_VIOLATION",
      "入力値が制約に違反しています",
      details
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnhandled(Exception e, HttpServletRequest req) {
    ErrorResponse body = new ErrorResponse(
      Instant.now(),
      req.getRequestURI(),
      HttpStatus.INTERNAL_SERVER_ERROR.value(),
      "INTERNAL_ERROR",
      "予期せぬエラーが発生しました",
      List.of(e.getMessage())
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  private String formatFieldError(FieldError fe) {
    return fe.getField() + ": " + fe.getDefaultMessage();
  }
}
