package com.haibazo.bookreview.author;

import jakarta.validation.constraints.NotBlank;

public final class AuthorDtos {
  private AuthorDtos() {}

  public record AuthorRequest(@NotBlank(message = "Please enter name") String name) {}

  public record AuthorResponse(Long id, String name, int books) {
    public static AuthorResponse from(Author author) {
      return new AuthorResponse(author.getId(), author.getName(), author.getBooks().size());
    }
  }
}
