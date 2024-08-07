package com.example.empeeAssociation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.empeeAssociation.Entity.DailyRecordOfPackageReport;
import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import com.example.empeeAssociation.Entity.MinuteRecordOfPackageReport;
import com.example.empeeAssociation.Exception.DataNotFoundException;
import com.example.empeeAssociation.Repository.DailyRecordOfPackageReportRepository;
import com.example.empeeAssociation.Repository.HourRecordOfPackageReportRepository;
import com.example.empeeAssociation.Repository.MinuteRecordOfPackageReportRepository;

@Service
public class FetchData {

    @Autowired
    private HourRecordOfPackageReportRepository hourRecordOfPackageReportRepository;

    @Autowired
    private DailyRecordOfPackageReportRepository dailyRecordOfPackageReportRepository;

    @Autowired
    private MinuteRecordOfPackageReportRepository minuteRecordOfPackageReportRepository;

    public List<HourRecordOfPackageReport> getDataOfaDay(LocalDate date) {
        List<HourRecordOfPackageReport> data = getDataBtwnTime(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        if (data.isEmpty()) {
            throw new DataNotFoundException("No data found for the specified date: " + date);
        }
        return data;
    }

    public List<HourRecordOfPackageReport> getDataBtwnTime(LocalDateTime startTime, LocalDateTime endTime) {
        List<HourRecordOfPackageReport> data = hourRecordOfPackageReportRepository.findByTimeStampBetween(startTime, endTime);
        if (data.isEmpty()) {
            throw new DataNotFoundException("No data found between the specified times.");
        }
        return data;
    }

    public List<DailyRecordOfPackageReport> getDataBtwnDates(LocalDate startDate, LocalDate endDate) {
        List<DailyRecordOfPackageReport> data = dailyRecordOfPackageReportRepository.findByDateBetween(startDate, endDate);
        if (data.isEmpty()) {
            throw new DataNotFoundException("No data found between the specified dates.");
        }
        return data;
    }
    public MinuteRecordOfPackageReport getLastUpdateData(){
        return minuteRecordOfPackageReportRepository.findLastRecord();
    }

}
