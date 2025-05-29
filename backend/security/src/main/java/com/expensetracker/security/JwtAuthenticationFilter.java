package com.expensetracker.security;

import com.expensetracker.core.model.User;
import com.expensetracker.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtProvider jwtProvider,
                                   UserRepository userRepository) {
        this.jwtProvider    = jwtProvider;
        this.userRepository = userRepository;
    }

    /**
     * Skip JWT validation on public auth endpoints.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1) Extract token from Authorization header
        String header = request.getHeader("Authorization");
        String token = null;
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        // 2) Validate token and load user
        if (token != null && jwtProvider.validateAccessToken(token)) {
            Long userId = jwtProvider.getUserIdFromAccessToken(token);
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                // 3) Build Authentication and set into context
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        user, 
                        null, 
                        user.getAuthorities()
                    );
                auth.setDetails(new WebAuthenticationDetailsSource()
                                  .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // 4) Continue filter chain
        filterChain.doFilter(request, response);
    }
}