package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.model.Profile;
import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * REST Controller for resume draft persistence in H2 Database.
 */
@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "https://*.vercel.app"})
public class ResumeController {

    private final ProfileRepository profileRepository;

    public ResumeController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public static class SaveResumeRequest {
        public Long id;
        public String fullName;
        public String email;
        public String desiredRole;
        public String targetTemplate;
        public String resumeJson;
    }

    /**
     * POST /api/resume/save - Saves or updates a resume profile in H2.
     */
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveResume(@RequestBody SaveResumeRequest request) {
        Profile profile;

        if (request.id != null && profileRepository.existsById(request.id)) {
            profile = profileRepository.findById(request.id).get();
        } else {
            profile = new Profile();
        }

        profile.setFullName(request.fullName != null ? request.fullName : "Untitled Resume");
        profile.setEmail(request.email);
        profile.setDesiredRole(request.desiredRole);
        profile.setTargetTemplate(request.targetTemplate);
        profile.setResumeJson(request.resumeJson);

        Profile saved = profileRepository.save(profile);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("status", "saved");
        response.put("message", "Resume saved successfully to database");
        response.put("updatedAt", saved.getUpdatedAt() != null ? saved.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/resume/latest - Returns the most recently updated resume draft.
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestResume() {
        Optional<Profile> latest = profileRepository.findTopByOrderByUpdatedAtDesc();
        if (latest.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile p = latest.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", p.getId());
        response.put("fullName", p.getFullName());
        response.put("email", p.getEmail());
        response.put("desiredRole", p.getDesiredRole());
        response.put("targetTemplate", p.getTargetTemplate());
        response.put("resumeJson", p.getResumeJson());
        response.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/resume/{id} - Loads a resume by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable Long id) {
        Optional<Profile> profile = profileRepository.findById(id);
        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile p = profile.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", p.getId());
        response.put("fullName", p.getFullName());
        response.put("email", p.getEmail());
        response.put("desiredRole", p.getDesiredRole());
        response.put("targetTemplate", p.getTargetTemplate());
        response.put("resumeJson", p.getResumeJson());
        response.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/resume/all - Summarizes all saved resume profiles.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllProfiles() {
        List<Profile> list = profileRepository.findAllByOrderByUpdatedAtDesc();
        List<Map<String, Object>> summaries = new ArrayList<>();

        for (Profile p : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("fullName", p.getFullName());
            map.put("email", p.getEmail());
            map.put("desiredRole", p.getDesiredRole());
            map.put("targetTemplate", p.getTargetTemplate());
            map.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
            summaries.add(map);
        }

        return ResponseEntity.ok(summaries);
    }
}
