package com.store.user.service;

import com.store.user.model.User;
import com.store.user.repo.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AppUserDetailsServiceTest {
    @Test
    void loadsUserByEmail() {
        var repo = mock(UserRepository.class);
        var svc = new AppUserDetailsService(repo);
        var u = new User();
        u.setEmail("jane@example.com");
        u.setPasswordHash("hash");
        when(repo.findByEmail("jane@example.com")).thenReturn(Optional.of(u));
        UserDetails details = svc.loadUserByUsername("jane@example.com");
        assertEquals("jane@example.com", details.getUsername());
        assertTrue(details.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }
}

