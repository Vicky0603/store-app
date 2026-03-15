package com.store.user.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AuthDtos {
    public static class RegisterRequest {
        @NotBlank public String firstName;
        @NotBlank public String lastName;
        @NotBlank public String shippingAddress;
        @Email @NotBlank public String email;
        @NotNull public LocalDate dateOfBirth;
        @NotBlank public String password;
    }

    public static class LoginRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }

    public static class JwtResponse {
        public String token;
        public JwtResponse(String token) { this.token = token; }
    }

    public static class PasswordResetInit {
        @Email @NotBlank public String email;
    }

    public static class PasswordResetComplete {
        @NotBlank public String token;
        @NotBlank public String newPassword;
    }
}

