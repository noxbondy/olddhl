package se.lexicon.skalmansfoodsleepclock.dto;

public record ResetPasswordRequestDto(String token,
                                      String newPassword) {
}
