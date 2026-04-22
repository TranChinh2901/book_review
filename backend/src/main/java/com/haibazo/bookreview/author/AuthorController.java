package com.haibazo.bookreview.author;

import com.haibazo.bookreview.author.AuthorDtos.AuthorRequest;
import com.haibazo.bookreview.author.AuthorDtos.AuthorResponse;
import com.haibazo.bookreview.common.NotFoundException;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {
  private final AuthorRepository authors;

  public AuthorController(AuthorRepository authors) {
    this.authors = authors;
  }

  @GetMapping
  public List<AuthorResponse> list() {
    return authors.findAll().stream()
        .sorted(Comparator.comparing(Author::getId))
        .map(AuthorResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AuthorResponse create(@Valid @RequestBody AuthorRequest request) {
    return AuthorResponse.from(authors.save(new Author(request.name().trim())));
  }

  @PutMapping("/{id}")
  public AuthorResponse update(@PathVariable Long id, @Valid @RequestBody AuthorRequest request) {
    Author author = findAuthor(id);
    author.setName(request.name().trim());
    return AuthorResponse.from(authors.save(author));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    Author author = findAuthor(id);
    authors.delete(author);
  }

  private Author findAuthor(Long id) {
    return authors.findById(id).orElseThrow(() -> new NotFoundException("Author not found."));
  }
}
