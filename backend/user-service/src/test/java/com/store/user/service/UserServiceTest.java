package com.store.user.service;

import com.store.user.model.User;
import com.store.user.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {
    private UserRepository repo;
    private PasswordEncoder encoder;
    private UserService service;

    @BeforeEach
    void setup(){
        repo = mock(UserRepository.class);
        encoder = mock(PasswordEncoder.class);
        service = new UserService(repo, encoder);
    }

    @Test
    void register_ok_whenAdult_andUniqueEmail() {
        User u = new User();
        u.setEmail("john@example.com");
        u.setFirstName("John");
        u.setLastName("Doe");
        u.setShippingAddress("Address");
        u.setDateOfBirth(LocalDate.now().minusYears(25));
        when(repo.existsByEmail("john@example.com")).thenReturn(false);
        when(encoder.encode("secret")).thenReturn("hash");

        service.register(u, "secret");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(repo).save(captor.capture());
        assertEquals("hash", captor.getValue().getPasswordHash());
    }

    @Test
    void register_fails_whenUnder18() {
        User u = new User();
        u.setEmail("kid@example.com");
        u.setFirstName("Kid");
        u.setLastName("Test");
        u.setShippingAddress("Addr");
        u.setDateOfBirth(LocalDate.now().minusYears(16));
        when(repo.existsByEmail("kid@example.com")).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> service.register(u, "p"));
        verify(repo, never()).save(Mockito.any());
    }

    @Test
    void register_fails_whenEmailExists() {
        User u = new User();
        u.setEmail("dup@example.com");
        u.setFirstName("Dup");
        u.setLastName("User");
        u.setShippingAddress("Addr");
        u.setDateOfBirth(LocalDate.now().minusYears(30));
        when(repo.existsByEmail("dup@example.com")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> service.register(u, "p"));
    }
}

