package com.nagarseva.backend.repository;

import com.nagarseva.backend.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WardRepository extends JpaRepository<Ward, Integer> {

    Optional<Ward> findByWardName(String wardName);

    boolean existsByWardName(String wardName);

    boolean existsByCouncillor_Id(Integer id);

    List<Ward> findAllByOrderByIdAsc();

    @Query("""
            SELECT w
            FROM Ward w
            WHERE
                LOWER(w.wardName) LIKE LOWER(CONCAT('%',:keyword,'%'))
                OR
                w.id = :wardId
            """)
    List<Ward> findAllWardsByKeyword(
            @Param("keyword") String keyword,
            @Param("wardId") Integer wardId
    );

}
