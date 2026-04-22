package com.haibazo.bookreview.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class ReviewDtos {
  private ReviewDtos() {}

  public record ReviewRequest(
      @NotNull(message = "Please select book") Long bookId,
      @NotBlank(message = "Please enter review") String review
  ) {}

  public record ReviewResponse(Long id, Long bookId, String book, Long authorId, String author, String review) {
    public static ReviewResponse from(Review review) {
      return new ReviewResponse(
          review.getId(),
          review.getBook().getId(),
          review.getBook().getTitle(),
          review.getBook().getAuthor().getId(),
          review.getBook().getAuthor().getName(),
          review.getContent()
      );
    }
  }
}
