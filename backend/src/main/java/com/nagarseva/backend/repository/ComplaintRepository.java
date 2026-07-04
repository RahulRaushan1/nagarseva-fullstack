package com.nagarseva.backend.repository;

import com.nagarseva.backend.entity.Complaint;
import com.nagarseva.backend.entity.Ward;
import com.nagarseva.backend.enums.IssueType;
import com.nagarseva.backend.enums.Status;
import com.nagarseva.backend.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {

    List<Complaint> findByIssueType(IssueType issueType);

    List<Complaint> findByWard_Id(Integer wardId);

    List<Complaint> findByStatus(Status status);

    Long countByCreatedById(Integer userId);

    Long countByCreatedByIdAndStatus(Integer userId, Status status);

    Long countByCreatedByIdAndStatusIn(Integer userId, List<Status> statuses);

    List<Complaint> findTop4ByCreatedByIdOrderByCreatedAtDesc(Integer userId);

    Long countByWardId(Integer wardId);

    Long countByWardIdAndStatusIn(Integer wardId, List<Status> statuses);

    Long countByWardIdAndStatus(Integer wardId, Status status);

    List<Complaint> findTop4ByWardIdOrderByCreatedAtDesc(Integer wardId);

    @Query("SELECT COUNT(DISTINCT c.assignedTo.id) FROM Complaint c WHERE c.ward.id = :wardId AND c.assignedTo IS NOT NULL")
    Long countDistinctOfficersByWardId(@Param("wardId") Integer wardId);

    Long countByAssignedToId(Integer officerId);

    Long countByAssignedToIdAndStatus(Integer officerId, Status status);

    Long countByAssignedToIdAndStatusIn(Integer officerId, List<Status> statuses);

    List<Complaint> findTop4ByAssignedToIdOrderByCreatedAtDesc(Integer officerId);

    Long countByAssignedToIdAndPriority(Integer officerId, Priority priority);

    List<Complaint> findByAssignedToIdAndStatusIn(Integer officerId, List<Status> statuses);

    @Query("""
            SELECT c FROM Complaint c
            WHERE c.createdBy.id = :userId
            AND (:issueType IS NULL OR c.issueType = :issueType)
            AND (:issueStatus IS NULL OR c.status = :issueStatus)
            """)
    Page<Complaint> findByUserIdWithFilters(
            @Param("userId")Integer userId,
            @Param("issueType") IssueType issueType,
            @Param("issueStatus") Status issueStatus,
            Pageable pageable);

    @Query("""
            SELECT c FROM Complaint c
            WHERE c.assignedTo.id = :userId
            AND (:ward IS NULL OR c.ward.id = :ward)
            AND (:issueStatus IS NULL OR c.status = :issueStatus)
            """)
    Page<Complaint> findByOfficerIdAndFilters(
            @Param("userId")Integer userId,
            @Param("ward") Integer wardId,
            @Param("issueStatus") Status issueStatus,
            Pageable pageable);

    @Query("""
            SELECT c FROM Complaint c
            WHERE (:ward IS NULL OR c.ward.id = :ward)
            AND (:issueStatus IS NULL OR c.status = :issueStatus)
            AND (:issueType IS NULL OR c.issueType = :issueType)
            """)
    Page<Complaint> findAllComplaints(
            @Param("ward") Integer wardId,
            @Param("issueStatus") Status issueStatus,
            @Param("issueType") IssueType issueType,
            Pageable pageable);


    Page<Complaint> findByTitleContainingIgnoreCaseOrId(
            String keyword,
            Integer id,
            Pageable pageable
            );

    @Query("""
            SELECT c FROM Complaint c
            WHERE c.assignedTo.id = :userId
            AND (
                CASE 
                    WHEN 
                        :issueStatus IS NULL
                    THEN 
                        c.status = com.nagarseva.backend.enums.Status.CLOSED
                        OR
                        c.status = com.nagarseva.backend.enums.Status.AUTO_CLOSED
                    ELSE
                        c.status = :issueStatus
                END
            )
            AND (
                :ward IS NULL OR c.ward.id = :ward
                )
            """)
    Page<Complaint> findAllResolvedComplaints(
            @Param("userId")Integer userId,
            @Param("ward") Integer wardId,
            @Param("issueStatus") Status issueStatus,
            Pageable pageable);


    @Query("""
            SELECT c 
            FROM Complaint c
            WHERE
                (
                    c.status = com.nagarseva.backend.enums.Status.CLOSED
                    OR
                    c.status = com.nagarseva.backend.enums.Status.AUTO_CLOSED
                )
            AND
                (
                    LOWER(c.title) LIKE LOWER(CONCAT('%',:keyword,'%'))
                    OR
                    c.id = :complaintId
                )    
            """)
    Page<Complaint> findAllResolvedComplaintsByKeyword(
            @Param("keyword") String keyword,
            @Param("complaintId") Integer complaintId,
            Pageable pageable
    );
}
