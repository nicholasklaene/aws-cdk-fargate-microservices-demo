package com.nicholasklaene.helloworldservice.models;

public class HelloWorldModel {
    private final String hello;

    public HelloWorldModel(String hello) {
        this.hello = hello;
    }

    public String getHello() {
        return this.hello;
    }
}
