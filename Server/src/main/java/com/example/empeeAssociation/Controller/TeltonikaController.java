package com.example.empeeAssociation.Controller;

import com.example.empeeAssociation.Dao.DataModel;
import com.example.empeeAssociation.Dao.DataModelAndProduction;
import com.example.empeeAssociation.Entity.DailyRecordOfPackageReport;
import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import com.example.empeeAssociation.Entity.MinuteRecordOfPackageReport;
import com.example.empeeAssociation.Service.FetchData;
import com.example.empeeAssociation.Service.InputDataService;
import com.example.empeeAssociation.Exception.DataNotFoundException;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class TeltonikaController {
    private final FetchData fetchData;
    private final SimpMessagingTemplate messagingTemplate;
    private final InputDataService inputDataService;

    public TeltonikaController(FetchData fetchData, SimpMessagingTemplate messagingTemplate, InputDataService inputDataService) {
        this.fetchData = fetchData;
        this.messagingTemplate = messagingTemplate;
        this.inputDataService = inputDataService;
    }

    @GetMapping("/")
    public ResponseEntity<String> data() {
        return ResponseEntity.ok("hiii");
    }

    @PostMapping("/data")
    public ResponseEntity<String> receiveData(@RequestBody String encodedData) {
        try {
            System.out.println("Received encoded data: " + encodedData);

            DataModelAndProduction dataModelAndProduction = inputDataService.decodeThedata(encodedData);
           
            messagingTemplate.convertAndSend("/topic/data", dataModelAndProduction);
            System.out.println(dataModelAndProduction);

            return ResponseEntity.ok("Data received and processed successfully.");

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Error decoding data");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error parsing data");
        }
    }

    @GetMapping("/report-of-date")
    public ResponseEntity<List<HourRecordOfPackageReport>> getReportOFDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<HourRecordOfPackageReport> data = fetchData.getDataOfaDay(date);
            return ResponseEntity.ok(data);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/report-between-two-hours")
    public ResponseEntity<List<HourRecordOfPackageReport>> getReportBetweenTwoHours(@RequestParam LocalDateTime startTime, @RequestParam LocalDateTime endTime) {
        try {
            List<HourRecordOfPackageReport> data = fetchData.getDataBtwnTime(startTime, endTime);
            return ResponseEntity.ok(data);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/report-between-two-dates")
    public ResponseEntity<List<DailyRecordOfPackageReport>> getReportBetweenTwoDates(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        try {
            List<DailyRecordOfPackageReport> data = fetchData.getDataBtwnDates(startDate, endDate);
            return ResponseEntity.ok(data);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/get-last-updates")
    public ResponseEntity<MinuteRecordOfPackageReport> getMethodName() {
        try {
            MinuteRecordOfPackageReport data = fetchData.getLastUpdateData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }

    }
    
}
