package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.model.Profile;
import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * REST Controller for resume draft persistence.
 * Mapped to /api/resume with routes for save, latest, id, all, and root info.
 */
@RestController
@RequestMapping("/api/resume")
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
     * GET /api/resume - Root info and API endpoint discovery.
     */
    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> getResumeApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("status", "Resume persistence API is active");
        info.put("endpoints", List.of(
                "POST /api/resume/save - Save or update resume draft",
                "GET /api/resume/latest - Get most recent resume draft",
                "GET /api/resume/all - Get all resume drafts",
                "GET /api/resume/{id} - Get resume draft by ID"
        ));
        info.put("totalDrafts", profileRepository.count());
        return ResponseEntity.ok(info);
    }

    /**
     * POST /api/resume/save - Saves or updates a resume profile.
     * Supports both /api/resume/save and /api/resume/save/
     */
    @PostMapping({"/save", "/save/"})
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
     * Supports both /api/resume/latest and /api/resume/latest/
     * If database is empty, returns HTTP 404 with structured JSON explaining the state.
     */
    @GetMapping({"/latest", "/latest/"})
    public ResponseEntity<?> getLatestResume() {
        Optional<Profile> latest = profileRepository.findTopByOrderByUpdatedAtDesc();
        if (latest.isEmpty()) {
            latest = profileRepository.findTopByOrderByIdDesc();
        }

        if (latest.isEmpty()) {
            Map<String, Object> notFoundResponse = new HashMap<>();
            notFoundResponse.put("status", "not_found");
            notFoundResponse.put("message", "No resume drafts found in database. Use POST /api/resume/save to persist a draft.");
            notFoundResponse.put("profile", null);
            return ResponseEntity.status(404).body(notFoundResponse);
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
    @GetMapping({"/{id}", "/{id}/"})
    public ResponseEntity<?> getResumeById(@PathVariable Long id) {
        Optional<Profile> profile = profileRepository.findById(id);
        if (profile.isEmpty()) {
            Map<String, Object> notFound = new HashMap<>();
            notFound.put("status", "not_found");
            notFound.put("message", "Resume profile with id " + id + " not found.");
            return ResponseEntity.status(404).body(notFound);
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
     * GET /api/resume/all - Returns all resume drafts ordered by last update.
     */
    @GetMapping({"/all", "/all/"})
    public ResponseEntity<List<Map<String, Object>>> getAllResumes() {
        List<Profile> profiles = profileRepository.findAllByOrderByUpdatedAtDesc();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Profile p : profiles) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("fullName", p.getFullName());
            map.put("email", p.getEmail());
            map.put("desiredRole", p.getDesiredRole());
            map.put("targetTemplate", p.getTargetTemplate());
            map.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
            responseList.add(map);
        }

        return ResponseEntity.ok(responseList);
    }
}
