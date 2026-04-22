package com.haibazo.bookreview.book;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
  @Override
  @EntityGraph(attributePaths = "author")
  List<Book> findAll();
}
