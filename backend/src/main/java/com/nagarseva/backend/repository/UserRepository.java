package com.nagarseva.backend.repository;

import com.nagarseva.backend.dto.OfficerDataDTO;
import com.nagarseva.backend.dto.OfficerSummaryDataDTO;
import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);

    long countByRole(Role role);

    @Query("""
            SELECT new com.nagarseva.backend.dto.OfficerDataDTO(
            u.id,
            u.fullName,
            u.department,
            u.active,
            
            SUM(
                CASE 
                    WHEN 
                        c.status = com.nagarseva.backend.enums.Status.ASSIGNED
                        OR
                        c.status = com.nagarseva.backend.enums.Status.REOPENED
                    THEN 1
                    ELSE 0
                END
            ),
            
            SUM(
                CASE
                    WHEN
                        c.status = com.nagarseva.backend.enums.Status.IN_PROGRESS
                        OR
                        c.status = com.nagarseva.backend.enums.Status.PENDING_VERIFICATION
                    THEN 1
                    ELSE 0
                END
            ),
            
            SUM(
                CASE
                    WHEN
                        c.status = com.nagarseva.backend.enums.Status.CLOSED
                        OR
                        c.status = com.nagarseva.backend.enums.Status.AUTO_CLOSED
                    THEN 1
                    ELSE 0
                END
            )
            )
            
            FROM User u
            LEFT JOIN u.assignedComplaints c
            WHERE 
                u.role = :role
                AND 
                (:department IS NULL OR u.department = :department)
            GROUP BY u.id, u.fullName, u.department, u.active
            """)
    Page<OfficerDataDTO> findAllOfficers(
            @Param("department") Department department,
            @Param("role") Role role,
            Pageable pageable
    );

    List<User> findAllByRole(Role role);

    @Query("""
            SELECT u.active,
            u.id,
            u.fullName, 
            COUNT(
                CASE 
                    WHEN c.status = com.nagarseva.backend.enums.Status.ASSIGNED
                        OR c.status = com.nagarseva.backend.enums.Status.IN_PROGRESS
                    THEN 1
                END
            )
            FROM User u
            LEFT JOIN u.assignedComplaints c
            WHERE
                u.department = :department
            GROUP BY u.active, u.id, u.fullName
            """)
    List<OfficerSummaryDataDTO> findAllOfficerByDepartment(
            @Param("department") Department department
    );

    @Query("""
            SELECT new com.nagarseva.backend.dto.OfficerDataDTO(
            u.id,
            u.fullName,
            u.department,
            u.active,
            
            SUM(
                CASE 
                    WHEN 
                        c.status = com.nagarseva.backend.enums.Status.ASSIGNED
                        OR
                        c.status = com.nagarseva.backend.enums.Status.REOPENED
                    THEN 1
                    ELSE 0
                END
            ),
            
            SUM(
                CASE
                    WHEN
                        c.status = com.nagarseva.backend.enums.Status.IN_PROGRESS
                        OR
                        c.status = com.nagarseva.backend.enums.Status.PENDING_VERIFICATION
                    THEN 1
                    ELSE 0
                END
            ),
            
            SUM(
                CASE
                    WHEN
                        c.status = com.nagarseva.backend.enums.Status.CLOSED
                        OR
                        c.status = com.nagarseva.backend.enums.Status.AUTO_CLOSED
                    THEN 1
                    ELSE 0
                END
            )
            )
            
            FROM User u
            LEFT JOIN u.assignedComplaints c
            WHERE 
                u.role = com.nagarseva.backend.enums.Role.OFFICER
                AND
                (
                    LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR
                    u.id = :officerId
                )
            GROUP BY u.id, u.fullName, u.department
            """)
    Page<OfficerDataDTO> findAllOfficersByKeyword(
            @Param("keyword") String keyword,
            @Param("officerId") Integer officerId,
            Pageable pageable
    );
}
