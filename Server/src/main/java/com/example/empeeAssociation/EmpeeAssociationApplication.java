package com.example.empeeAssociation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;

import com.example.empeeAssociation.ErrorClass.TeltonikaConnectionError;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class EmpeeAssociationApplication {

    @Autowired
    private TeltonikaConnectionError connectionError;

    public static void main(String[] args) {
        SpringApplication.run(EmpeeAssociationApplication.class, args);
    }

    @PostConstruct
    public void init() {
        connectionError.start();
    }
	@EventListener(ContextClosedEvent.class)
    public void onShutdown() {
        connectionError.stopThread();
    }
}
