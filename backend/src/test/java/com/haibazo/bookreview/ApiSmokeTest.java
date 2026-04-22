package com.haibazo.bookreview;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiSmokeTest {
  @Autowired
  private MockMvc mvc;

  @Test
  void listsSeededAuthorsBooksAndReviews() throws Exception {
    mvc.perform(get("/api/authors"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
        .andExpect(jsonPath("$[0].name").value("Jack Troute"))
        .andExpect(jsonPath("$[0].books").value(10));

    mvc.perform(get("/api/books"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
        .andExpect(jsonPath("$[0].title").value("The 22 Immutable Laws of Marketing"));

    mvc.perform(get("/api/reviews"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))));
  }

  @Test
  void validatesAuthorNameAndSupportsDelete() throws Exception {
    mvc.perform(post("/api/authors")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.name").value("Please enter name"));

    String location = mvc.perform(post("/api/authors")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Ursula Le Guin\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name").value("Ursula Le Guin"))
        .andReturn()
        .getResponse()
        .getContentAsString();

    Long id = Long.valueOf(location.replaceAll(".*\"id\":(\\d+).*", "$1"));
    mvc.perform(delete("/api/authors/{id}", id))
        .andExpect(status().isNoContent());
  }

  @Test
  void createsAndUpdatesReviewWithAuthorData() throws Exception {
    String created = mvc.perform(post("/api/reviews")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"bookId\":1,\"review\":\"Excellent read\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.bookId").value(1))
        .andExpect(jsonPath("$.authorId").value(1))
        .andExpect(jsonPath("$.author").value("Jack Troute"))
        .andExpect(jsonPath("$.review").value("Excellent read"))
        .andReturn()
        .getResponse()
        .getContentAsString();

    Long reviewId = Long.valueOf(created.replaceAll(".*\"id\":(\\d+).*", "$1"));

    mvc.perform(put("/api/reviews/{id}", reviewId)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"bookId\":11,\"review\":\"Updated review\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.bookId").value(11))
        .andExpect(jsonPath("$.authorId").value(2))
        .andExpect(jsonPath("$.author").value("Inamori Kazuo"))
        .andExpect(jsonPath("$.review").value("Updated review"));
  }
}
