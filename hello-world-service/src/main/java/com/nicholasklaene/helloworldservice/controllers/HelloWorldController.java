package com.nicholasklaene.helloworldservice.controllers;

import com.nicholasklaene.helloworldservice.models.ErrorModel;
import com.nicholasklaene.helloworldservice.models.HelloWorldModel;
import com.nicholasklaene.helloworldservice.models.NameModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloWorldController {
    @Autowired
    RestTemplate restTemplate;

    Logger logger = LoggerFactory.getLogger(HelloWorldController.class);

    @GetMapping("/{name}")
    public ResponseEntity<?> getHelloWorld(@PathVariable String name) {
        try {
            String nameServiceURL = System.getenv("env").equals("dev") ? "http://host.docker.internal:8082/name/"
                    : "http://" + System.getenv("LOAD_BALANCER_DNS") + "/name/";

            NameModel nameModel = restTemplate.getForObject(nameServiceURL + name, NameModel.class);
            HelloWorldModel helloWorldModel = new HelloWorldModel(nameModel.getName());
            return ResponseEntity.ok(helloWorldModel);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(500).body(new ErrorModel(e.getMessage()));
        }
    }

    @GetMapping("/internal/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(null);
    }
}
