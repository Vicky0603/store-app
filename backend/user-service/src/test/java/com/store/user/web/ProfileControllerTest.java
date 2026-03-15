package com.store.user.web;

import com.store.user.model.User;
import com.store.user.repo.UserRepository;
import com.store.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProfileControllerTest {
    @Test
    void getAndUpdateProfile() {
        var repo = mock(UserRepository.class);
        var service = mock(UserService.class);
        var controller = new ProfileController(repo, service);

        var u = new User();
        u.setId(1L); u.setEmail("me@example.com"); u.setFirstName("Me"); u.setLastName("User");
        u.setShippingAddress("Addr"); u.setDateOfBirth(LocalDate.now().minusYears(20));
        when(repo.findByEmail("me@example.com")).thenReturn(Optional.of(u));

        var principal = new org.springframework.security.core.userdetails.User("me@example.com","x", java.util.List.of());
        ResponseEntity<?> res = controller.me(principal);
        Map<?,?> body = (Map<?,?>) res.getBody();
        assertEquals("me@example.com", body.get("email"));

        var updates = new User(); updates.setFirstName("New"); updates.setLastName("Name"); updates.setShippingAddress("New addr"); updates.setDateOfBirth(u.getDateOfBirth());
        when(service.updateProfile(1L, updates)).thenReturn(u);
        ResponseEntity<?> upd = controller.update(principal, updates);
        assertNotNull(((Map<?,?>)upd.getBody()).get("id"));
    }
}

