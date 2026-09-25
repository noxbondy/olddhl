package se.lexicon.skalmansfoodsleepclock.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.lexicon.skalmansfoodsleepclock.Entity.PasswordResetToken;
import se.lexicon.skalmansfoodsleepclock.dto.LoginRequestDto;
import se.lexicon.skalmansfoodsleepclock.dto.RegisterRequestDto;
import se.lexicon.skalmansfoodsleepclock.Entity.Role;
import se.lexicon.skalmansfoodsleepclock.Entity.User;
import se.lexicon.skalmansfoodsleepclock.dto.UserDto;
import se.lexicon.skalmansfoodsleepclock.repository.PasswordResetTokenRepository;
import se.lexicon.skalmansfoodsleepclock.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpI implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;


    private void validatePassword(String password) {
        String passwordPattern =
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

        if (!password.matches(passwordPattern)) {
            throw new RuntimeException(
                    "Password must be at least 8 characters long, " +
                            "contain at least one uppercase letter, one lowercase letter, " +
                            "one digit, and one special character"
            );
        }
    }


    @Override
    public User register(RegisterRequestDto dto, String roleName) {
        if (userRepository.existsByPersonalNumber(dto.personalNumber())) {
            throw new RuntimeException("Personal number already exists");
        }
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email already exists");
        }

        // ✅ Validate password strength
        validatePassword(dto.password());

        Role role;
        try {
            role = Role.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleName);
        }

        User user = User.builder()
                .personalNumber(dto.personalNumber())
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .dateOfBirth(dto.dateOfBirth())
                .gender(dto.gender())
                .phoneNumber(dto.phoneNumber())
                .address(dto.address())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password())) // ✅ store encoded
                .role(role)
                .build();

        return userRepository.save(user);
    }

    @Override
    public UserDto login(LoginRequestDto request) {
        // Authenticate credentials (Spring Security)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Fetch user from DB
        User user = findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Convert User -> UserDto
        return UserDto.fromEntity(user);
    }

    @Override
    public UserDto getUserByPersonalNumber(String personalNumber) {
        return userRepository.findByPersonalNumber(personalNumber)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Optional<User> findByEmailIgnoreCase(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(Optional::of)
                .orElse(Optional.empty());
    }

    @Override
    public List<UserDto> findAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public UserDto updateUserRole(String personalNumber, Role role) {
        User user = userRepository.findByPersonalNumber(personalNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        userRepository.save(user);
        return UserDto.fromEntity(user);
    }


    @Override
    @Transactional
    public void deleteUser(String personalNumber) {
        User user = userRepository.findByPersonalNumber(personalNumber)
                .orElseThrow(() -> new RuntimeException("User not found with personal number: " + personalNumber));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("No account found with this email"));

        // Delete old reset tokens
        passwordResetTokenRepository.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink =
                "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Reset Your Password");

        message.setText(
                "Hello " + user.getFirstName() + ",\n\n" +
                        "You requested to reset your password.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 30 minutes.\n\n" +
                        "If you did not request this password reset, please ignore this email."
        );

        mailSender.send(message);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid reset token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset token has already been used");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        validatePassword(newPassword);

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        resetToken.setUsed(true);

        passwordResetTokenRepository.save(resetToken);
    }
}





