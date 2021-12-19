package com.nicholasklaene.helloworldservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@SpringBootApplication
public class HelloWorldServiceApplication {

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(HelloWorldServiceApplication.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", System.getenv("PORT")));
		app.run(args);
	}

}

