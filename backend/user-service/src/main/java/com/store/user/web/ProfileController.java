package com.store.user.web;

import com.store.user.model.User;
import com.store.user.repo.UserRepository;
import com.store.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
public class ProfileController {
    private final UserRepository repo;
    private final UserService userService;

    public ProfileController(UserRepository repo, UserService userService) {
        this.repo = repo;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails principal) {
        var u = repo.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName(),
                "shippingAddress", u.getShippingAddress(),
                "email", u.getEmail(),
                "dateOfBirth", u.getDateOfBirth()
        ));
    }

    @PutMapping
    public ResponseEntity<?> update(@AuthenticationPrincipal UserDetails principal,
                                    @Valid @RequestBody User updates) {
        var u = repo.findByEmail(principal.getUsername()).orElseThrow();
        var saved = userService.updateProfile(u.getId(), updates);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }
}
