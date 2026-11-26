package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.model.Profile;
import com.dualtechdiaries.resumeapp.model.User;
import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * REST Controller for resume persistence with strict user isolation.
 * Every resume belongs to an authenticated user.
 * Users can only create, view, update, and delete their own resumes.
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
        public String title;
        public String fullName;
        public String email;
        public String desiredRole;
        public String targetTemplate;
        public String resumeJson;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    /**
     * GET /api/resume - Root info and API endpoint discovery.
     */
    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> getResumeApiInfo(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Map<String, Object> info = new HashMap<>();
        info.put("status", "Resume persistence API is active (User-isolated)");
        info.put("currentUser", user != null ? user.getEmail() : null);
        info.put("endpoints", List.of(
                "POST /api/resume/save - Save or update authenticated user's resume",
                "GET /api/resume/latest - Get current user's most recent resume",
                "GET /api/resume/my - Get all resumes for current user",
                "GET /api/resume/{id} - Get resume by ID (ownership verified)",
                "DELETE /api/resume/{id} - Delete resume by ID (ownership verified)"
        ));
        if (user != null) {
            info.put("myResumesCount", profileRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).size());
        }
        return ResponseEntity.ok(info);
    }

    /**
     * POST /api/resume/save - Saves or updates a resume belonging to the authenticated user.
     * Prevents modifying another user's resume.
     */
    @PostMapping({"/save", "/save/"})
    public ResponseEntity<Map<String, Object>> saveResume(
            @RequestBody SaveResumeRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "unauthorized");
            err.put("message", "Authentication required to save resumes.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Profile profile = null;

        // 1. If explicit record ID is provided: verify ownership
        if (request.id != null) {
            Optional<Profile> existingOpt = profileRepository.findById(request.id);
            if (existingOpt.isPresent()) {
                Profile existing = existingOpt.get();
                // Check if owned by another user
                if (existing.getUserId() != null && !existing.getUserId().equals(user.getId())) {
                    Map<String, Object> forbidden = new HashMap<>();
                    forbidden.put("status", "forbidden");
                    forbidden.put("message", "Access denied: You do not have permission to modify another user's resume.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(forbidden);
                }
                // If it was a legacy resume without user_id, associate it with this user
                profile = existing;
            }
        }

        // 2. If no ID provided or ID not found, check if user already has a resume with this title or draft
        if (profile == null) {
            profile = new Profile();
            profile.setUserId(user.getId());
        } else {
            profile.setUserId(user.getId());
        }

        String displayName = request.fullName != null && !request.fullName.trim().isEmpty()
                ? request.fullName.trim()
                : user.getFullName();

        String resumeTitle = request.title != null && !request.title.trim().isEmpty()
                ? request.title.trim()
                : (request.desiredRole != null && !request.desiredRole.trim().isEmpty()
                    ? request.desiredRole.trim() + " Resume"
                    : displayName + "'s Resume");

        profile.setTitle(resumeTitle);
        profile.setFullName(displayName);
        profile.setEmail(request.email != null && !request.email.trim().isEmpty() ? request.email.trim() : user.getEmail());
        profile.setDesiredRole(request.desiredRole);
        profile.setTargetTemplate(request.targetTemplate);
        profile.setResumeJson(request.resumeJson);

        Profile saved = profileRepository.save(profile);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("title", saved.getTitle());
        response.put("status", "saved");
        response.put("message", "Resume saved successfully to database");
        response.put("updatedAt", saved.getUpdatedAt() != null ? saved.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/resume/latest - Returns current user's most recent resume.
     * Never returns another user's resume.
     */
    @GetMapping({"/latest", "/latest/"})
    public ResponseEntity<?> getLatestResume(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "unauthorized");
            err.put("message", "Authentication required.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Optional<Profile> latest = profileRepository.findTopByUserIdOrderByUpdatedAtDesc(user.getId());

        // Also check if user has a legacy profile matched by email that isn't claimed yet
        if (latest.isEmpty()) {
            List<Profile> legacy = profileRepository.findByEmailOrderByUpdatedAtDesc(user.getEmail());
            if (!legacy.isEmpty()) {
                Profile p = legacy.get(0);
                if (p.getUserId() == null) {
                    p.setUserId(user.getId());
                    profileRepository.save(p);
                    latest = Optional.of(p);
                }
            }
        }

        if (latest.isEmpty()) {
            Map<String, Object> notFoundResponse = new HashMap<>();
            notFoundResponse.put("status", "not_found");
            notFoundResponse.put("message", "No resume drafts found for this user account.");
            notFoundResponse.put("profile", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFoundResponse);
        }

        Profile p = latest.get();
        Map<String, Object> response = formatProfileResponse(p);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/resume/{id} - Loads a resume by ID with ownership verification.
     */
    @GetMapping({"/{id}", "/{id}/"})
    public ResponseEntity<?> getResumeById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "unauthorized");
            err.put("message", "Authentication required.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            Map<String, Object> notFound = new HashMap<>();
            notFound.put("status", "not_found");
            notFound.put("message", "Resume profile with id " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFound);
        }

        Profile p = profileOpt.get();

        // Strict ownership check: prevent User A from accessing User B's resume
        if (p.getUserId() != null && !p.getUserId().equals(user.getId())) {
            Map<String, Object> forbidden = new HashMap<>();
            forbidden.put("status", "forbidden");
            forbidden.put("message", "Access denied: You do not have permission to view another user's resume.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(forbidden);
        }

        // Claim legacy resume if unassigned and matches email
        if (p.getUserId() == null && user.getEmail().equalsIgnoreCase(p.getEmail())) {
            p.setUserId(user.getId());
            profileRepository.save(p);
        }

        return ResponseEntity.ok(formatProfileResponse(p));
    }

    /**
     * GET /api/resume/my - Returns all resumes for the authenticated user.
     */
    @GetMapping({"/my", "/my/", "/all", "/all/"})
    public ResponseEntity<List<Map<String, Object>>> getMyResumes(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Profile> profiles = profileRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Profile p : profiles) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("title", p.getTitle() != null ? p.getTitle() : (p.getFullName() + "'s Resume"));
            map.put("fullName", p.getFullName());
            map.put("email", p.getEmail());
            map.put("desiredRole", p.getDesiredRole());
            map.put("targetTemplate", p.getTargetTemplate());
            map.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
            map.put("createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
            responseList.add(map);
        }

        return ResponseEntity.ok(responseList);
    }

    /**
     * DELETE /api/resume/{id} - Deletes a resume with ownership verification.
     */
    @DeleteMapping({"/{id}", "/{id}/"})
    public ResponseEntity<Map<String, Object>> deleteResume(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "unauthorized");
            err.put("message", "Authentication required.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            Map<String, Object> notFound = new HashMap<>();
            notFound.put("status", "not_found");
            notFound.put("message", "Resume with id " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFound);
        }

        Profile p = profileOpt.get();
        if (p.getUserId() != null && !p.getUserId().equals(user.getId())) {
            Map<String, Object> forbidden = new HashMap<>();
            forbidden.put("status", "forbidden");
            forbidden.put("message", "Access denied: You cannot delete another user's resume.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(forbidden);
        }

        profileRepository.delete(p);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Resume deleted successfully.");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> formatProfileResponse(Profile p) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", p.getId());
        response.put("userId", p.getUserId());
        response.put("title", p.getTitle());
        response.put("fullName", p.getFullName());
        response.put("email", p.getEmail());
        response.put("desiredRole", p.getDesiredRole());
        response.put("targetTemplate", p.getTargetTemplate());
        response.put("resumeJson", p.getResumeJson());
        response.put("updatedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
        response.put("createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
        return response;
    }
}
