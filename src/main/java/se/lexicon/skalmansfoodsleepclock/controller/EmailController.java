package se.lexicon.skalmansfoodsleepclock.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.lexicon.skalmansfoodsleepclock.service.EmailService;

import java.util.Map;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {

        try {
            emailService.sendEmail(to, subject, body);
            return ResponseEntity.ok("Email sent");

        } catch (Exception e) {
            e.printStackTrace();   // IMPORTANT

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", e.getMessage(),
                            "type", e.getClass().getName()
                    )
            );
        }
    }
}
