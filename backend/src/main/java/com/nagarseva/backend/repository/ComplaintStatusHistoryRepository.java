package com.nagarseva.backend.repository;

import com.nagarseva.backend.dto.StatusCountDTO;
import com.nagarseva.backend.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Integer> {

    @Query("""
            SELECT c.status, COUNT(c.status)
            FROM ComplaintStatusHistory c
            WHERE c.solvedByOfficer.id = :officerId
            AND c.status 
            IN ('ASSIGNED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'CLOSED', 'AUTO_CLOSED')
            GROUP BY c.status
            """)
    List<StatusCountDTO> findAllComplaintsStatusOfOfficer(
            @Param("officerId") Integer officerId);

    List<ComplaintStatusHistory> findTop5ByComplaintCreatedByIdOrderByChangedAtDesc(Integer citizenId);
}
