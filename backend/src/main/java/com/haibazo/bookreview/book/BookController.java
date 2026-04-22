package com.haibazo.bookreview.book;

import com.haibazo.bookreview.author.Author;
import com.haibazo.bookreview.author.AuthorRepository;
import com.haibazo.bookreview.book.BookDtos.BookRequest;
import com.haibazo.bookreview.book.BookDtos.BookResponse;
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
@RequestMapping("/api/books")
public class BookController {
  private final BookRepository books;
  private final AuthorRepository authors;

  public BookController(BookRepository books, AuthorRepository authors) {
    this.books = books;
    this.authors = authors;
  }

  @GetMapping
  public List<BookResponse> list() {
    return books.findAll().stream()
        .sorted(Comparator.comparing(Book::getId))
        .map(BookResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BookResponse create(@Valid @RequestBody BookRequest request) {
    Author author = findAuthor(request.authorId());
    return BookResponse.from(books.save(new Book(request.title().trim(), author)));
  }

  @PutMapping("/{id}")
  public BookResponse update(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
    Book book = findBook(id);
    book.setTitle(request.title().trim());
    book.setAuthor(findAuthor(request.authorId()));
    return BookResponse.from(books.save(book));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    books.delete(findBook(id));
  }

  private Book findBook(Long id) {
    return books.findById(id).orElseThrow(() -> new NotFoundException("Book not found."));
  }

  private Author findAuthor(Long id) {
    return authors.findById(id).orElseThrow(() -> new NotFoundException("Author not found."));
  }
}
