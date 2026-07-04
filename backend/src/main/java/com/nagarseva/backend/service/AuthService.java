package com.nagarseva.backend.service;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.entity.Ward;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.exception.*;
import com.nagarseva.backend.repository.UserRepository;
import com.nagarseva.backend.repository.WardRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@AllArgsConstructor
public class AuthService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private WardRepository wardRepository;
    private EmailService emailService;

    public RegisterCitizenResponse createNewCitizenAccount(RegisterCitizenRequest registerCitizenRequest) {

        if (userRepository.existsByEmail(registerCitizenRequest.getEmail())) {
            throw new UserAlreadyExistsException("Username already exists.");
        }

        Ward ward = wardRepository.findById(registerCitizenRequest.getWardId()).orElseThrow(
                () -> new InvalidWardException("Invalid ward Id")
        );

        User citizen = new User();
        citizen.setEmail(registerCitizenRequest.getEmail());
        citizen.setPassword(passwordEncoder.encode(registerCitizenRequest.getPassword()));
        citizen.setFullName(registerCitizenRequest.getFullName());
        citizen.setRole(Role.CITIZEN);
        citizen.setCitizensWard(ward);
        citizen.setActive(true);
        citizen.setNotificationEnabled(registerCitizenRequest.getEmailConsent());

        User savedCitizen = userRepository.save(citizen);

        if (citizen.getNotificationEnabled())
            emailService.sendRegistrationSuccessEmail(savedCitizen.getFullName(), savedCitizen.getEmail());

        RegisterCitizenResponse response = new RegisterCitizenResponse();
        response.setSuccess(true);
        response.setMessage("Citizen Account Created Successfully.");

        return response;
    }

    public LoginUserResponse authenticateUser(LoginUserRequest loginUserRequest) {

        Authentication auth = new UsernamePasswordAuthenticationToken(
                loginUserRequest.getEmail(),
                loginUserRequest.getPassword()
        );

        Authentication authResult = null;

        try {
            authResult = authenticationManager.authenticate(auth);
        } catch (DisabledException e) {
            throw new AccountDisabledException("Your account is currently inactive. Please contact administrator.");
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String authenticatedRole = authResult.getAuthorities()
                .stream()
                .findFirst()
                .get()
                .getAuthority();

        LoginUserResponse response = new LoginUserResponse();
        response.setSuccess(true);
        response.setMessage("Logged In Successfully");
        response.setToken(jwtService.generateToken(authResult.getName(), authenticatedRole));

        return response;

    }

    public OTPGeneratedResponse generateOtpForForgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("No User Found with this email")
        );

        LocalDateTime lastOTPGenerated = user.getResetOtpExpiry();

        if (lastOTPGenerated != null) {
            LocalDateTime current = LocalDateTime.now();
            LocalDateTime otpGeneratedAt = lastOTPGenerated.minusMinutes(10);
            if (current.isBefore(otpGeneratedAt.plusSeconds(30))) {
                throw new OTPRequestTooFrequentException("Too many OTP requests. Try again after 30 seconds.");
            }
        }

        Random random = new Random();
        String otp = String.valueOf(random.nextInt(100000,1000000));

        LocalDateTime current = LocalDateTime.now();

        user.setResetOtp(otp);
        user.setResetOtpExpiry(current.plusMinutes(10));

        User savedUser = userRepository.save(user);

        OTPGeneratedResponse response = new OTPGeneratedResponse();
        response.setSuccess(true);
        response.setMessage("OTP Generated successfully");

        emailService.sendOTPGenerationEmail(savedUser.getResetOtp(),savedUser.getEmail());

        return response;
    }

    public OTPGeneratedResponse validateOTP(ForgotPasswordRequest forgotPasswordRequest) {
        User user = userRepository.findByEmail(forgotPasswordRequest.getEmail()).orElseThrow(
                () -> new UserNotFoundException("No User Found with this email")
        );

        if (user.getResetOtpExpiry() == null) {
            throw new OTPNotGeneratedException("No OTP has been generated. Please generate one first.");
        }

        if (!user.getResetOtp().equals(forgotPasswordRequest.getOtp())) {
            throw new OTPInvalidException("OTP is invalid");
        }

        LocalDateTime current = LocalDateTime.now();

        if (current.isAfter(user.getResetOtpExpiry())) {
            throw new OTPExpiredException("OTP is Expired");
        }
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        user.setResetOtpVerifiedUntil(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        OTPGeneratedResponse response = new OTPGeneratedResponse();
        response.setSuccess(true);
        response.setMessage("OTP validated successfully. You can change your password within 5 minutes.");

        return response;
    }
}
