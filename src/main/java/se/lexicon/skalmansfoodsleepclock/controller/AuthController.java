package se.lexicon.skalmansfoodsleepclock.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.lexicon.skalmansfoodsleepclock.Entity.Role;
import se.lexicon.skalmansfoodsleepclock.dto.ForgotPasswordRequestDto;
import se.lexicon.skalmansfoodsleepclock.dto.LoginRequestDto;
import se.lexicon.skalmansfoodsleepclock.dto.RegisterRequestDto;
import se.lexicon.skalmansfoodsleepclock.dto.ResetPasswordRequestDto;
import se.lexicon.skalmansfoodsleepclock.dto.UserDto;
import se.lexicon.skalmansfoodsleepclock.Entity.User;
import se.lexicon.skalmansfoodsleepclock.repository.UserRepository;
import se.lexicon.skalmansfoodsleepclock.service.AuthService;

import java.util.List;
import java.util.Optional;
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;


    // ============================================================
    // FORGOT PASSWORD
    // POST /auth/forgot-password
    // ============================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequestDto request) {

        System.out.println("========== FORGOT PASSWORD ==========");
        System.out.println("CONTROLLER REACHED");
        System.out.println("EMAIL: " + request.email());
        System.out.println("=====================================");

        try {
            authService.forgotPassword(request.email());

            return ResponseEntity.ok(
                    "Password reset link has been sent to your email."
            );

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    // ============================================================
    // REGISTER
    // POST /auth/register
    // ============================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequestDto dto,
            @RequestParam String roleName) {

        try {

            User user = authService.register(dto, roleName);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(UserDto.fromEntity(user));

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ============================================================
    // LOGIN
    // POST /auth/login
    // ============================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDto request) {

        try {

            UserDto userDto = authService.login(request);

            return ResponseEntity.ok(userDto);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }






    // ============================================================
    // RESET PASSWORD
    // POST /auth/reset-password
    // ============================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequestDto request) {

        try {

            authService.resetPassword(
                    request.token(),
                    request.newPassword()
            );

            return ResponseEntity.ok(
                    "Password has been reset successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ============================================================
    // GET USER BY PERSONAL NUMBER
    // GET /auth/{personalNumber}
    // ============================================================

    @GetMapping("/{personalNumber}")
    public ResponseEntity<?> getUserByPersonalNumber(
            @PathVariable String personalNumber) {

        try {

            UserDto userDto =
                    authService.getUserByPersonalNumber(personalNumber);

            return ResponseEntity.ok(userDto);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // ============================================================
    // CHECK EMAIL
    // GET /auth/email/{email}
    // ============================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<Boolean> checkEmail(
            @PathVariable String email) {

        Optional<User> userOpt =
                authService.findByEmailIgnoreCase(email);

        return ResponseEntity.ok(userOpt.isPresent());
    }


    // ============================================================
    // UPDATE USER
    // PUT /auth/users/{personalNumber}
    // ============================================================

    @PutMapping("/users/{personalNumber}")
    public ResponseEntity<?> updateUser(
            @PathVariable String personalNumber,
            @RequestBody RegisterRequestDto dto) {

        try {

            User user = userRepository
                    .findByPersonalNumber(personalNumber)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            user.setFirstName(dto.firstName());
            user.setLastName(dto.lastName());
            user.setEmail(dto.email());
            user.setPhoneNumber(dto.phoneNumber());
            user.setAddress(dto.address());
            user.setGender(dto.gender());
            user.setDateOfBirth(dto.dateOfBirth());

            userRepository.save(user);

            return ResponseEntity.ok(
                    UserDto.fromEntity(user)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ============================================================
    // GET ALL USERS
    // GET /auth/users
    // ============================================================

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {

        List<UserDto> users =
                authService.findAllUsers();

        return ResponseEntity.ok(users);
    }


    // ============================================================
    // DELETE USER
    // DELETE /auth/{personalNumber}
    // ============================================================

    @DeleteMapping("/{personalNumber}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String personalNumber) {

        try {

            authService.deleteUser(personalNumber);

            return ResponseEntity.noContent().build();

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/users/{personalNumber}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String personalNumber,
            @RequestParam String roleName) {

        try {
            Role role = Role.valueOf(roleName.toUpperCase());

            UserDto updatedUser =
                    authService.updateUserRole(personalNumber, role);

            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid role: " + roleName);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}