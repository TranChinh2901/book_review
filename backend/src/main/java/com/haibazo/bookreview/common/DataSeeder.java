package com.haibazo.bookreview.common;

import com.haibazo.bookreview.author.Author;
import com.haibazo.bookreview.author.AuthorRepository;
import com.haibazo.bookreview.book.Book;
import com.haibazo.bookreview.book.BookRepository;
import com.haibazo.bookreview.review.Review;
import com.haibazo.bookreview.review.ReviewRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {
  private final boolean enabled;
  private final AuthorRepository authors;
  private final BookRepository books;
  private final ReviewRepository reviews;

  public DataSeeder(
      @Value("${app.seed.enabled}") boolean enabled,
      AuthorRepository authors,
      BookRepository books,
      ReviewRepository reviews
  ) {
    this.enabled = enabled;
    this.authors = authors;
    this.books = books;
    this.reviews = reviews;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (!enabled || authors.count() > 0) {
      return;
    }

    Author jack = authors.save(new Author("Jack Troute"));
    Author inamori = authors.save(new Author("Inamori Kazuo"));
    Author stephen = authors.save(new Author("Stephen King"));
    Author rowling = authors.save(new Author("J. K. Rowling"));
    authors.save(new Author("Dan Brown"));

    Book immutable = saveBook("The 22 Immutable Laws of Marketing", jack);
    Book positioning = saveBook("Positioning: The Battle for Your Mind", jack);
    Book harry = saveBook("Harry Potter and the Philosopher's Stone", rowling);
    Book grave = saveBook("The Running Grave", rowling);
    Book shining = saveBook("The Shining", stephen);

    fillBooks(jack, 8, "Jack Troute archive");
    fillBooks(inamori, 5, "Inamori Kazuo archive");
    fillBooks(stephen, 4, "Stephen King archive");
    fillBooks(rowling, 3, "J. K. Rowling archive");
    fillBooks(authors.findByNameIgnoreCase("Dan Brown").orElseThrow(), 5, "Dan Brown archive");

    reviews.save(new Review(immutable, "Good book!"));
    reviews.save(new Review(positioning, "Very good!"));
    reviews.save(new Review(harry, "Nice book!"));
    reviews.save(new Review(grave, "I'm so excited!"));
    reviews.save(new Review(shining, "I recommend this book!"));
  }

  private Book saveBook(String title, Author author) {
    return books.save(new Book(title, author));
  }

  private void fillBooks(Author author, int count, String prefix) {
    for (int index = 1; index <= count; index++) {
      saveBook(prefix + " " + index, author);
    }
  }
}
