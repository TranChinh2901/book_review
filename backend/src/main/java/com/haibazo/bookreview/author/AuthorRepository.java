package com.haibazo.bookreview.author;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
  @Override
  @EntityGraph(attributePaths = "books")
  List<Author> findAll();

  Optional<Author> findByNameIgnoreCase(String name);
}
