package com.nicholasklaene.nameservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class NameServiceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(NameServiceApplication.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", System.getenv("PORT")));
		app.run(args);
	}

}
