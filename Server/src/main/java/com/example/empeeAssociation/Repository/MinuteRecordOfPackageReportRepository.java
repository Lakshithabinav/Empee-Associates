package com.example.empeeAssociation.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.empeeAssociation.Entity.MinuteRecordOfPackageReport;

public interface MinuteRecordOfPackageReportRepository extends JpaRepository<MinuteRecordOfPackageReport, Long> {
    List<MinuteRecordOfPackageReport> findByTimeStampBetween(LocalDateTime start, LocalDateTime end);

    @Query(value = "SELECT * FROM minute_record_of_package_report ORDER BY id DESC LIMIT 1", nativeQuery = true)
    MinuteRecordOfPackageReport findLastRecord();
}
