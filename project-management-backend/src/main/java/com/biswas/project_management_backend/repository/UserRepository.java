package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByCompanyId(Long companyId);
    Long countByCompanyId(Long companyId);
    User findByUsernameAndCompanyId(String userName, Long companyId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.company.id = :companyId AND u.lastActiveDate >= :sinceDate")
    Long countActiveUsersLastWeek(@Param("companyId") Long companyId, @Param("sinceDate") LocalDate sinceDate);
}
