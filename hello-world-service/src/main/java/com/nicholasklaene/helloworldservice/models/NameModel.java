package com.nicholasklaene.helloworldservice.models;

public class NameModel {
    private String name;

    public NameModel() {}

    public NameModel(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
