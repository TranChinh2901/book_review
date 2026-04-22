package com.haibazo.bookreview.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class BookDtos {
  private BookDtos() {}

  public record BookRequest(
      @NotBlank(message = "Please enter name") String title,
      @NotNull(message = "Please select author") Long authorId
  ) {}

  public record BookResponse(Long id, String title, Long authorId, String author) {
    public static BookResponse from(Book book) {
      return new BookResponse(
          book.getId(),
          book.getTitle(),
          book.getAuthor().getId(),
          book.getAuthor().getName()
      );
    }
  }
}
