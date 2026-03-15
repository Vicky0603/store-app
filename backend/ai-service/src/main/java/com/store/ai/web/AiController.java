package com.store.ai.web;

import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
public class AiController {
    private final RestClient http;
    private final String catalogBase;

    public AiController(@Value("${catalog.baseUrl}") String catalogBase){
        this.http = RestClient.create();
        this.catalogBase = catalogBase;
    }

    @GetMapping("/semantic/search")
    public Object semanticSearch(@RequestParam @NotBlank String q){
        var products = fetchProducts(q);
        if (products.isEmpty()) return List.of();
        Map<String,Integer> queryVec = vectorize(q);
        return products.stream()
                .sorted(Comparator.comparing((Map p) -> -similarity(queryVec, vectorize((String)p.getOrDefault("name",""), (String)p.getOrDefault("description","")))))
                .limit(24).toList();
    }

    @PostMapping("/chat")
    public Map<String,Object> chat(@RequestBody Map<String,String> body){
        String question = Optional.ofNullable(body.get("question")).orElse("");
        var products = fetchProducts(extractKeywords(question));
        var top = products.stream().limit(3).collect(Collectors.toList());
        StringBuilder answer = new StringBuilder();
        if (top.isEmpty()) answer.append("No encontre productos relacionados. Prueba con otras palabras.");
        else {
            answer.append("Estas opciones pueden interesarte: ");
            for (int i=0;i<top.size();i++){
                var p = top.get(i);
                answer.append(String.format("%s (%s) %s", p.get("name"), p.get("price"), i<top.size()-1? "; ":"."));
            }
        }
        return Map.of("answer", answer.toString(), "products", top);
    }

    private List<Map> fetchProducts(String q){
        try{
            var url = catalogBase + "/api/products" + (q!=null && !q.isBlank()? ("?q="+q):"");
            var resp = http.get().uri(url).retrieve().toEntity(List.class);
            return resp.getBody() != null ? (List<Map>)resp.getBody() : List.of();
        }catch(Exception e){ return List.of(); }
    }

    private Map<String,Integer> vectorize(String name, String desc){ return vectorize(name + " " + desc); }
    private Map<String,Integer> vectorize(String text){
        String[] tokens = Optional.ofNullable(text).orElse("").toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]"," ").split("\\s+");
        Map<String,Integer> freq = new HashMap<>();
        for (String t : tokens){ if (t.isBlank()) continue; freq.put(t, freq.getOrDefault(t, 0)+1);} 
        return freq;
    }
    private double similarity(Map<String,Integer> a, Map<String,Integer> b){
        Set<String> vocab = new HashSet<>(a.keySet()); vocab.addAll(b.keySet());
        double dot=0, na=0, nb=0; for (String t: vocab){ int va=a.getOrDefault(t,0), vb=b.getOrDefault(t,0); dot+=va*vb; na+=va*va; nb+=vb*vb; }
        if (na==0||nb==0) return 0.0; return dot/(Math.sqrt(na)*Math.sqrt(nb));
    }
    private String extractKeywords(String q){
        return Optional.ofNullable(q).orElse("")
                .replaceAll("(?i)(recomienda|suger|tengo|busco|quiero|me|para|de|un|una)", " ")
                .trim();
    }
}
