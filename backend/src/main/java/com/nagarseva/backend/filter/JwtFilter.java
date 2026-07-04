package com.nagarseva.backend.filter;

import com.nagarseva.backend.security.CustomUserDetails;
import com.nagarseva.backend.service.CustomUserDetailsService;
import com.nagarseva.backend.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private JwtService jwtService;
    private CustomUserDetailsService customUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null) {
            try {
                email = jwtService.getEmail(token);
            } catch (ExpiredJwtException e) {
                sendError(response, "TOKEN_EXPIRED","Token Expired");
                return;
            } catch (SignatureException e) {
                sendError(response, "SIGNATURE_FAILED","Signature Verification Failed");
                return;
            } catch (Exception e) {
                sendError(response,"INVALID_TOKEN","Invalid token");
                return;
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userdetails = customUserDetailsService.loadUserByUsername(email);

            if (jwtService.validateToken(token, userdetails.getUsername())) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userdetails,
                        null,
                        userdetails.getAuthorities()
                );

                CustomUserDetails customUser = (CustomUserDetails) userdetails;

                String path = request.getRequestURI();

                if (customUser.isDefaultPassword()) {
                    if (!path.equals("/change-password")) {
                        sendError(response, "PASSWORD_UPDATE_REQUIRED","Kindly Update your password.");
                        return;
                    }
                }

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
         }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, String code, String message) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String body = """
        {
            "success": false,
            "code": "%s",
            "message": "%s"
        }
        """.formatted(code,message);

        response.getWriter().write(body);
    }
}
