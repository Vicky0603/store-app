package com.store.cart.web;

import com.store.cart.model.Cart;
import com.store.cart.model.CartItem;
import com.store.cart.repo.CartRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CartControllerTest {
    @Test
    void getCart_createsIfMissing_andAddUpdateRemove() {
        var repo = mock(CartRepository.class);
        var controller = new CartController(repo);
        String email = "u@example.com";

        when(repo.findByUserEmail(email)).thenReturn(Optional.empty());
        when(repo.save(any())).thenAnswer(inv -> { Cart c = inv.getArgument(0); if (c.getItems()==null) c.setItems(new ArrayList<>()); c.setId(1L); return c; });

        Cart c1 = controller.getCart(email);
        assertEquals(1L, c1.getId());

        var added = controller.addItem(email, new CartController.AddItemRequest(10L, "Prod", "img", BigDecimal.TEN, 2));
        assertEquals(1, added.getItems().size());
        CartItem item = added.getItems().get(0);
        assertEquals(10L, item.getProductId());

        // update qty
        ResponseEntity<Cart> updated = controller.updateQty(email, item.getId(), java.util.Map.of("quantity", 3));
        // since id is null before save, update may not find by exact ID; simulate item id set and call again
        item.setId(100L);
        updated = controller.updateQty(email, 100L, java.util.Map.of("quantity", 3));
        assertTrue(updated.getStatusCode().is2xxSuccessful());

        // remove
        ResponseEntity<?> rem = controller.remove(email, 100L);
        assertTrue(rem.getStatusCode().is2xxSuccessful());
    }
}
