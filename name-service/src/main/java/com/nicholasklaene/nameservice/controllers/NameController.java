package com.nicholasklaene.nameservice.controllers;

import com.nicholasklaene.nameservice.models.NameModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/name")
public class NameController {
    @GetMapping("/{name}")
    public ResponseEntity<NameModel> getName(@PathVariable String name) {
        List<String> lastNames = Arrays.asList("Washington", "Lincoln", "Obama", "Clinton", "Trump", "Biden", "Bush");
        int randomIndex = (int) Math.floor(Math.random() * lastNames.size());
        String lastName = lastNames.get(randomIndex);
        NameModel nameModel = new NameModel(name + " " + lastName);
        return ResponseEntity.ok(nameModel);
    }

    @GetMapping("/internal/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(null);
    }
}
