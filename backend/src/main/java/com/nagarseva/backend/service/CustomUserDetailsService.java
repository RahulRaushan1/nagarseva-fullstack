package com.nagarseva.backend.service;

import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.repository.UserRepository;
import com.nagarseva.backend.security.CustomUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userRecords = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User Not Found")
        );

        return new CustomUserDetails(userRecords);

    }
}
