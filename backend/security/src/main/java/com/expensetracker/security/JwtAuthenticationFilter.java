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
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import java.io.IOException;


/**
 * This filter will:
 *   1) Skip any requests under /api/auth/**
 *   2) Otherwise, look for a Bearer token in the "Authorization" header
 *   3) If present, call jwtProvider.validateAccessToken(token)
 *      - validateAccessToken(...) should check signature + "exp" internally
 *   4) If valid, load the User from the database and set
 *      SecurityContextHolder.getContext().setAuthentication(...)
 *   5) Whether valid or not, we always call filterChain.doFilter(...) at the end.
 */
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
     * Skip JWT validation on any path that starts with /api/auth/
     * (e.g. login, register, magic-link endpoints).
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

        // 1) Extract token
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.debug("JwtAuthenticationFilter: Authorization header → " + header);

        String token = null;
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
            logger.debug("JwtAuthenticationFilter: Parsed token → " + token);
        } else {
            logger.debug("JwtAuthenticationFilter: No Bearer token in header");
        }

        // 2) If we got a token, validate it
        if (token != null) {
            try {
                boolean valid = jwtProvider.validateAccessToken(token);
                logger.debug("JwtAuthenticationFilter: validateAccessToken? → " + valid);
                if (valid) {
                    Long userId = jwtProvider.getUserIdFromAccessToken(token);
                    logger.debug("JwtAuthenticationFilter: userId from token → " + userId);

                    User user = userRepository.findById(userId).orElse(null);
                    if (user != null) {
                        logger.debug("JwtAuthenticationFilter: Found user in DB → " + user.getEmail());
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                            );
                        authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("JwtAuthenticationFilter: Authentication set in SecurityContext");
                    } else {
                        logger.debug("JwtAuthenticationFilter: No user found for id → " + userId);
                    }
                }
            } catch (JwtException ex) {
                logger.debug("JwtAuthenticationFilter: JWT validation exception → " + ex.getMessage());
            }
        }

        // 3) 필터 체인 계속
        filterChain.doFilter(request, response);
    }
}