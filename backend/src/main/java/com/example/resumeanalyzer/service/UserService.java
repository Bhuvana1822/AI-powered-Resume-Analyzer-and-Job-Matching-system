package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.dto.*;
import com.example.resumeanalyzer.entity.User;
import com.example.resumeanalyzer.exception.BadRequestException;
import com.example.resumeanalyzer.exception.ResourceNotFoundException;
import com.example.resumeanalyzer.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getEmail(), encodedPassword);
        User savedUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        UserDTO userDTO = new UserDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail());

        return new AuthResponse(token, userDTO, "User registered successfully!");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String token = UUID.randomUUID().toString();
        UserDTO userDTO = new UserDTO(user.getId(), user.getName(), user.getEmail());

        return new AuthResponse(token, userDTO, "Login successful!");
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }
}
