package com.biswas.project_management_backend.service.impl;

import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Role;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.RoleRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import com.biswas.project_management_backend.service.AdminService;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String saveUsersFromCsv(MultipartFile file, String adminIdentifier) throws Exception {
        Optional<User> adminOpt = userRepository.findByUsername(adminIdentifier);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin user not found");
        }

        User admin = adminOpt.get();
        Company company = admin.getCompany();
        if (company == null) {
            throw new IllegalStateException("Admin is not associated with any company");
        }

        int added = 0, skipped = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] line;

            while ((line = reader.readNext()) != null) {
                // Expected columns: name, email, role
                if (line.length < 3) {
                    skipped++;
                    continue;
                }

                String username = line[0].trim();
                String email = line[1].trim();
                String roleName = line[2].trim().toUpperCase();

                // Skip duplicates
                if (userRepository.existsByEmail(email)) {
                    skipped++;
                    continue;
                }

                Optional<Role> roleOpt = roleRepository.findByName(roleName);
                if (roleOpt.isEmpty()) {
                    skipped++;
                    continue;
                }

                // Create new user
                User user = new User();
                user.setUsername(username);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(email)); // You can generate random
                user.setCompany(company);
                user.getRoles().add(roleOpt.get());

                userRepository.save(user);
                added++;
            }
        }

        return added + " users uploaded successfully, " + skipped + " skipped (duplicates or invalid)";
    }
}
