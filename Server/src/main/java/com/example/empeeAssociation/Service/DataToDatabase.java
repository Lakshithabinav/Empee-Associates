package com.example.empeeAssociation.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.empeeAssociation.Dao.DataModel;
import com.example.empeeAssociation.Entity.DailyRecordOfPackageReport;
import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import com.example.empeeAssociation.Entity.MinuteRecordOfPackageReport;
import com.example.empeeAssociation.Repository.DailyRecordOfPackageReportRepository;
import com.example.empeeAssociation.Repository.HourRecordOfPackageReportRepository;
import com.example.empeeAssociation.Repository.MinuteRecordOfPackageReportRepository;

@Service
public class DataToDatabase {

    @Autowired
    private MinuteRecordOfPackageReportRepository minuteRecordOfPackageReportRepository;

    @Autowired 
    private HourRecordOfPackageReportRepository hourRecordOfPackageReportRepository;

    @Autowired
    private DailyRecordOfPackageReportRepository dailyRecordOfPackageReportRepository;

    private long lotNumber = 0;
    private LocalDate lastDataRecoded = LocalDate.now();
    private long oldNoOfPieces = 0;
    private long oldTotalAccumValue = 0;
    long totalAccumValue;

    public void dataSaveInDB(List<DataModel> dataModels) {
        OptionalInt piecesIndex = IntStream.range(0, dataModels.size())
                .filter(i -> "Peices".equals(dataModels.get(i).getName()))
                .findFirst();
        OptionalInt totalAccumIndex = IntStream.range(0, dataModels.size())
                .filter(i -> "TotalAccum".equals(dataModels.get(i).getName()))
                .findFirst();
        
        if (piecesIndex.isPresent() && totalAccumIndex.isPresent()&& oldTotalAccumValue!=0) {
            long newNoOfPieces = dataModels.get(piecesIndex.getAsInt()).getData();
            totalAccumValue = dataModels.get(totalAccumIndex.getAsInt()).getData();
            
            if (newNoOfPieces > oldNoOfPieces) {
                aggitateMinuteProduction(dataModels.get(piecesIndex.getAsInt()).getTime(), totalAccumValue, totalAccumValue - oldTotalAccumValue);
                oldTotalAccumValue = totalAccumValue;
                oldNoOfPieces = newNoOfPieces;
            }
        }
        else if(oldTotalAccumValue==0){
            oldTotalAccumValue = dataModels.get(totalAccumIndex.getAsInt()).getData(); 
        } 
        else {
            System.out.println("Required data not present in the provided data models.");
        }
    }

    private void aggitateMinuteProduction(LocalDateTime localDateTime, long totalAccumValue, long weight) {
        MinuteRecordOfPackageReport minuteRecordOfPackageReport = new MinuteRecordOfPackageReport();
        minuteRecordOfPackageReport.setTimeStamp(localDateTime);
        minuteRecordOfPackageReport.setTotalAccum(totalAccumValue);
        minuteRecordOfPackageReport.setWeight(weight);

        if (lastDataRecoded.equals(localDateTime.toLocalDate())) {
            lotNumber++;
        } else {
            lotNumber = 1;
        }
        String lotName = localDateTime.toLocalDate().toString() + "-" + lotNumber;
        minuteRecordOfPackageReport.setLotName(lotName);
        minuteRecordOfPackageReportRepository.save(minuteRecordOfPackageReport);
        lastDataRecoded = localDateTime.toLocalDate();

        aggitateHourlyProduction(localDateTime.withMinute(0).withSecond(0).withNano(0));
        aggitateDailyProduction(localDateTime.toLocalDate());
    }

    private void aggitateHourlyProduction(LocalDateTime hour) {
        List<MinuteRecordOfPackageReport> minuteRecordOfPackageReports = minuteRecordOfPackageReportRepository.findByTimeStampBetween(hour, hour.plusHours(1));

        List<HourRecordOfPackageReport> hourlyProductions = hourRecordOfPackageReportRepository.findByTimeStamp(hour);
        HourRecordOfPackageReport hourlyProduction;

        if (hourlyProductions.isEmpty()) {
            hourlyProduction = new HourRecordOfPackageReport();
        } else {
            hourlyProduction = hourlyProductions.get(0); 
        }

        long totalWeightValue = minuteRecordOfPackageReports.stream().mapToLong(MinuteRecordOfPackageReport::getWeight).sum();

        hourlyProduction.setNoOfLoot(minuteRecordOfPackageReports.size());
        hourlyProduction.setTimeStamp(hour);
        hourlyProduction.setTotalAccum(minuteRecordOfPackageReports.get(minuteRecordOfPackageReports.size() - 1).getTotalAccum());
        hourlyProduction.setWeight(totalWeightValue);

        hourRecordOfPackageReportRepository.save(hourlyProduction);
    }

    public void aggitateDailyProduction(LocalDate date) {
        List<HourRecordOfPackageReport> hourRecordOFPackageReports = hourRecordOfPackageReportRepository.findByTimeStampBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        DailyRecordOfPackageReport dailyRecordOfPackageReport;
        Optional<DailyRecordOfPackageReport> dailyReportOpt = dailyRecordOfPackageReportRepository.findByDate(date);
        
        if (dailyReportOpt.isPresent()) {
            dailyRecordOfPackageReport = dailyReportOpt.get();
        } else {
            dailyRecordOfPackageReport = new DailyRecordOfPackageReport();
            dailyRecordOfPackageReport.setDate(date);
        }

        long totalWeight = hourRecordOFPackageReports.stream().mapToLong(HourRecordOfPackageReport::getWeight).sum();
        long totalAccum = hourRecordOFPackageReports.stream().mapToLong(HourRecordOfPackageReport::getTotalAccum).max().orElse(0);
        long totalNoOfLoots = hourRecordOFPackageReports.stream().mapToLong(HourRecordOfPackageReport::getNoOfLoot).sum();
        dailyRecordOfPackageReport.setTotalAccum(totalAccum);
        dailyRecordOfPackageReport.setWeight(totalWeight);
        dailyRecordOfPackageReport.setNoOfLoot(totalNoOfLoots);

        dailyRecordOfPackageReportRepository.save(dailyRecordOfPackageReport);
    }
}
