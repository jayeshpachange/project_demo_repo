package com.resort.solution.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                return config;
            }))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
        		.requestMatchers(
        		        "/user/resort/topResort",
        		        "/user/resort/getByLoc",
        		        "/user/resort/getById",
        		        "/user/resort/getAllResort",
        		        "/user/resort/getResortImg",
        		        "/user/login",
        		        "/user/review/getReviewByResort",
        		        "/user/review/getResortRating"
        		 ).permitAll()
        		.requestMatchers(
        			"/owner/login",
        			"/owner/registerOwner"
        		).permitAll()
                // Public endpoints
                .requestMatchers(
                    "/admin/login",
                    "/admin/register",                  
                    "/user/register",
                    "/user/payments/*",
                    "/user/bookings/initiateBooking",
                    "/user/bookings/*/services",
                    "/user/bookings/services/*",
                    "/user/bookings/service/getAll",
                    "/user/bookings/*/confirm",
                    "/user/bookings/getbookingDetailsById/*",
                    "/user/bookings/roomByBookingId/*",
                    "/user/me",
                    "/user/changePassword/*",
                    "/user/bookings/rooms/*",   //for deleting room
                    "/user/bookings/getBookingRoomByBookingId/*",
                    "/user/foodOrder/*",
                    "/user/resort/addImage",
                    "/user/payments/booking/*"
                ).permitAll()

                // Role-based access (NO PATH DEPENDENCY)
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/owner/**").hasAnyRole("ADMIN" , "OWNER")
                .requestMatchers("/user/**").hasAnyRole("USER" ,"ADMIN" , "OWNER")

                // Any other request must be authenticated
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}








//package com.resort.solution.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//
//@Configuration
//public class SecurityConfig {
//
//    @Autowired
//    private JwtFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//            .csrf(csrf -> csrf.disable())
////            .cors(cors->{})
//            .authorizeHttpRequests(auth -> auth
//                    .requestMatchers("/admin/login", "/admin/register", "/user/login", "/user/register" , "/admin/city/addCity").permitAll()
//                    .anyRequest().authenticated()
//            )
//            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
//        return authConfig.getAuthenticationManager();
//    }
//}
