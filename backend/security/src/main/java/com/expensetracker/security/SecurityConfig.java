package com.expensetracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// NEW imports for CORS
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
            // ① Enable CORS support
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // disable CSRF for non-browser clients
            .csrf(csrf -> csrf.disable())

            // allow H2 console frames
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))

            // set session to stateless (we’ll use JWT in headers)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // configure URL-based authorization
            .authorizeHttpRequests(auth -> auth
                // allow only these three without authentication
                .requestMatchers("/h2-console/**").permitAll()
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

    /**
     * Defines the CORS policy for /api/** endpoints.
     * Allows your React app (http://localhost:5173) to call the API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ② Whitelist your Vite dev server origin
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        // ③ Allow the HTTP methods your UI will use
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // ④ Allow all headers (or restrict if you want)
        config.setAllowedHeaders(List.of("*"));
        // ⑤ If you ever send cookies or HTTP-only JWTs, enable credentials
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // apply this config to all /api/** endpoints
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}