package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.UserRole;
import com.biswas.project_management_backend.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
}