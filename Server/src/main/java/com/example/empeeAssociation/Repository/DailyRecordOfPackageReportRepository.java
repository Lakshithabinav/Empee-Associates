package com.example.empeeAssociation.Repository;

import com.example.empeeAssociation.Entity.DailyRecordOfPackageReport;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyRecordOfPackageReportRepository extends JpaRepository<DailyRecordOfPackageReport, Long> {
    Optional<DailyRecordOfPackageReport> findByDate(LocalDate date);
    List<DailyRecordOfPackageReport> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    
}
