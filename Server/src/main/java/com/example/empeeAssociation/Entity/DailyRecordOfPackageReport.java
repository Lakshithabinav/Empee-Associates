package com.example.empeeAssociation.Entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class DailyRecordOfPackageReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDate date; 
    private long noOfLoot;

    private long weight;

    private long totalAccum; // Changed to camelCase

    // Lombok @Data annotation will generate getter and setter methods
}
