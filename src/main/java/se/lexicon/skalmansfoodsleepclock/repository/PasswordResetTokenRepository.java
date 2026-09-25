package se.lexicon.skalmansfoodsleepclock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.lexicon.skalmansfoodsleepclock.Entity.PasswordResetToken;
import se.lexicon.skalmansfoodsleepclock.Entity.User;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}