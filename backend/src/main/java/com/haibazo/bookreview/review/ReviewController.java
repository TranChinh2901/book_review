package com.haibazo.bookreview.review;

import com.haibazo.bookreview.book.Book;
import com.haibazo.bookreview.book.BookRepository;
import com.haibazo.bookreview.common.NotFoundException;
import com.haibazo.bookreview.review.ReviewDtos.ReviewRequest;
import com.haibazo.bookreview.review.ReviewDtos.ReviewResponse;
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
@RequestMapping("/api/reviews")
public class ReviewController {
  private final ReviewRepository reviews;
  private final BookRepository books;

  public ReviewController(ReviewRepository reviews, BookRepository books) {
    this.reviews = reviews;
    this.books = books;
  }

  @GetMapping
  public List<ReviewResponse> list() {
    return reviews.findAll().stream()
        .sorted(Comparator.comparing(Review::getId))
        .map(ReviewResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ReviewResponse create(@Valid @RequestBody ReviewRequest request) {
    Book book = findBook(request.bookId());
    Review savedReview = reviews.save(new Review(book, request.review().trim()));
    return ReviewResponse.from(findReview(savedReview.getId()));
  }

  @PutMapping("/{id}")
  public ReviewResponse update(@PathVariable Long id, @Valid @RequestBody ReviewRequest request) {
    Review review = findReview(id);
    review.setBook(findBook(request.bookId()));
    review.setContent(request.review().trim());
    Review savedReview = reviews.save(review);
    return ReviewResponse.from(findReview(savedReview.getId()));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    reviews.delete(findReview(id));
  }

  private Review findReview(Long id) {
    return reviews.findById(id).orElseThrow(() -> new NotFoundException("Review not found."));
  }

  private Book findBook(Long id) {
    return books.findById(id).orElseThrow(() -> new NotFoundException("Book not found."));
  }
}
