package com.expensetracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1) CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 2) Disable CSRF (stateless JWT)
            .csrf(csrf -> csrf.disable())

            // 3) Stateless session management
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4) Authorization rules
            .authorizeHttpRequests(auth -> auth
                // allow CORS preflight everywhere
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // allow all actuator endpoints
                .requestMatchers("/actuator/**").permitAll()

                .requestMatchers("/error").permitAll()

                // **explicitly** whitelist each public auth endpoint
                .requestMatchers(HttpMethod.POST,   "/api/auth/magic-link").permitAll()
                .requestMatchers(HttpMethod.POST,   "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET,   "/api/auth/magic-link/confirm").permitAll()
                // H2 console if used
                .requestMatchers("/h2-console/**").permitAll()

                // everything else requires a valid JWT
                .anyRequest().authenticated()
            )

            // 5) disable frameOptions for H2
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))

            // 6) JWT filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Apply CORS policy so that your React app on http://localhost:5173 can talk to /api/**
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}