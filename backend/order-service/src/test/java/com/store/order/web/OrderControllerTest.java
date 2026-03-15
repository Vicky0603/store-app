package com.store.order.web;

import com.store.order.model.Order;
import com.store.order.repo.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderControllerTest {
    @Test
    void confirmComputesTotal_andListByUser() {
        var repo = mock(OrderRepository.class);
        var controller = new OrderController(repo);
        var principal = new org.springframework.security.core.userdetails.User("o@example.com","x", java.util.List.of());

        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var req = new OrderController.ConfirmRequest();
        var it = new OrderController.Item();
        it.productId = 1L; it.productName = "Prod"; it.price = new BigDecimal("10.50"); it.quantity = 2; it.imageUrl = "img";
        req.items = List.of(it);
        req.overrideShippingAddress = "Addr";
        ResponseEntity<?> res = controller.confirm(principal, req);
        var map = (java.util.Map<?,?>) res.getBody();
        assertEquals(new BigDecimal("21.00"), map.get("total"));

        var o = new Order(); o.setUserEmail("o@example.com");
        when(repo.findByUserEmailOrderByCreatedAtDesc("o@example.com")).thenReturn(List.of(o));
        var list = controller.list(principal);
        assertEquals(1, list.size());
    }
}

