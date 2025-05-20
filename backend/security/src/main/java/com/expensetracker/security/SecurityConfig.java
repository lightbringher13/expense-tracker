package com.expensetracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // disable CSRF for non-browser clients
            .csrf(csrf -> csrf.disable())

            // allow H2 console frames
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))

            // set session to stateless (we’ll use JWT in headers)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // configure URL-based authorization
            .authorizeHttpRequests(auth -> auth
                // allow only these three without authentication
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/verify",
                    "/api/auth/login"
                ).permitAll()
                // all other requests require a valid JWT
                .anyRequest().authenticated()
            )

            // insert our JWT filter before Spring’s username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}