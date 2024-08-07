package com.example.empeeAssociation.Repository;

import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HourRecordOfPackageReportRepository extends JpaRepository<HourRecordOfPackageReport, Long> {
    List<HourRecordOfPackageReport> findByTimeStampBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
    List<HourRecordOfPackageReport> findByTimeStamp(LocalDateTime timeStamp);
}
