package com.nagarseva.backend.configs;

import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class DataInitializer {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        return args -> {

            boolean adminExists = userRepository.existsByRole(Role.ADMIN);

            if (!adminExists) {
                System.out.println("Admin Not Found. Creating Admin..");
                User user = new User();
                user.setEmail(adminEmail);
                user.setPassword(passwordEncoder.encode(adminPassword));
                user.setRole(Role.ADMIN);
                user.setActive(true);
                user.setDefaultPassword(true);
                user.setFullName("Default Admin");
                user.setNotificationEnabled(false);

                userRepository.save(user);
                System.out.println("Admin Created Successfully.");
            }
        };
    }
}
