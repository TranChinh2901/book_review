package com.haibazo.bookreview.common;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  private final List<String> allowedOrigins;

  public CorsConfig(@Value("${app.cors.allowed-origins}") String origins) {
    this.allowedOrigins = List.of(origins.split(",")).stream()
        .map(String::trim)
        .filter(origin -> !origin.isEmpty())
        .collect(Collectors.toList());
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(allowedOrigins.toArray(String[]::new))
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*");
  }
}
