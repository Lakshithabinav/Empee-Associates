package com.example.empeeAssociation.Dao;

import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class DataModel {
    
    private String name;
    private long data;
    private LocalDateTime time;


    @JsonProperty("data")
    public void setData(String data) {
        this.data = parseData(data).get(0);
    }

   
 


    public long  getData() {
        return data;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getTime() {
        return time;
    }

    @JsonProperty("time")
    public void setTime(String time) {
        this.time = parseTime(time);
    }

    private List<Integer> parseData(String data) {
        data = data.replace("[", "").replace("]", "");
        String[] dataArray = data.split(",");
        return Arrays.stream(dataArray).map(Integer::parseInt).collect(Collectors.toList());
    }

    private LocalDateTime parseTime(String time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return LocalDateTime.parse(time, formatter);
    }

    @Override
    public String toString() {
        return "DataModel{" +
                "data=" + data +
                ", name='" + name + '\'' +
                ", time=" + time +
                '}';
    }
}
