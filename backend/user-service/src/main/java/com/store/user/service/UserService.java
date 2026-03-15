package com.store.user.service;

import com.store.user.model.User;
import com.store.user.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User register(User u, String rawPassword) {
        if (repo.existsByEmail(u.getEmail())) throw new IllegalArgumentException("Email ya registrado");
        if (!isAdult(u.getDateOfBirth())) throw new IllegalArgumentException("Debe ser mayor de 18 anios");
        u.setPasswordHash(encoder.encode(rawPassword));
        return repo.save(u);
    }

    public Optional<User> findByEmail(String email) { return repo.findByEmail(email); }

    public User updateProfile(Long id, User updates) {
        var u = repo.findById(id).orElseThrow();
        u.setFirstName(updates.getFirstName());
        u.setLastName(updates.getLastName());
        u.setShippingAddress(updates.getShippingAddress());
        u.setDateOfBirth(updates.getDateOfBirth());
        return repo.save(u);
    }

    public String initPasswordReset(String email) {
        var u = repo.findByEmail(email).orElseThrow();
        String token = UUID.randomUUID().toString();
        u.setResetToken(token);
        repo.save(u);
        return token;
    }

    public void completePasswordReset(String token, String newPassword) {
        var u = repo.findByResetToken(token).orElseThrow();
        u.setPasswordHash(encoder.encode(newPassword));
        u.setResetToken(null);
        repo.save(u);
    }

    private boolean isAdult(LocalDate dob) {
        if (dob == null) return false;
        return Period.between(dob, LocalDate.now()).getYears() >= 18;
    }
}
