package com.store.user.web;

import com.store.user.model.User;
import com.store.user.security.JwtUtil;
import com.store.user.service.UserService;
import com.store.user.web.dto.AuthDtos;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
        User u = new User();
        u.setFirstName(req.firstName);
        u.setLastName(req.lastName);
        u.setShippingAddress(req.shippingAddress);
        u.setEmail(req.email);
        u.setDateOfBirth(req.dateOfBirth);
        var saved = userService.register(u, req.password);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email, req.password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(req.email, Map.of("role", "USER"));
        return ResponseEntity.ok(new AuthDtos.JwtResponse(token));
    }

    @PostMapping("/password/reset/init")
    public ResponseEntity<?> resetInit(@Valid @RequestBody AuthDtos.PasswordResetInit req) {
        String token = userService.initPasswordReset(req.email);
        // En un entorno real, enviar este token por email al usuario
        return ResponseEntity.ok(Map.of("resetToken", token));
    }

    @PostMapping("/password/reset/complete")
    public ResponseEntity<?> resetComplete(@Valid @RequestBody AuthDtos.PasswordResetComplete req) {
        userService.completePasswordReset(req.token, req.newPassword);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
