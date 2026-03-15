package com.store.catalog.web;

import com.store.catalog.model.Product;
import com.store.catalog.repo.ProductRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductControllerTest {
    @Test
    void listAndSearch() {
        var repo = mock(ProductRepository.class);
        var controller = new ProductController(repo);
        when(repo.findAll()).thenReturn(List.of(product(1L,"A")));
        when(repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase("ball","ball"))
                .thenReturn(List.of(product(2L, "Ball")));

        var all = controller.list(null);
        assertEquals(1, all.size());
        var search = controller.list("ball");
        assertEquals(1, search.size());
        assertEquals("Ball", search.get(0).getName());
    }

    private Product product(Long id, String name){
        var p = new Product(); p.setId(id); p.setName(name); p.setPrice(BigDecimal.TEN); p.setQuantity(5); p.setImageUrl("img"); return p;
    }
}

