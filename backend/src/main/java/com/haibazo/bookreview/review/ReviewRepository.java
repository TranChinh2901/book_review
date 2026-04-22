package com.haibazo.bookreview.review;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
  @Override
  @EntityGraph(attributePaths = {"book", "book.author"})
  List<Review> findAll();

  @Override
  @EntityGraph(attributePaths = {"book", "book.author"})
  Optional<Review> findById(Long id);
}
