package com.dualtechdiaries.resumeapp.repository;

import com.dualtechdiaries.resumeapp.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Profile entities with user isolation.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findTopByOrderByUpdatedAtDesc();

    Optional<Profile> findTopByOrderByIdDesc();

    List<Profile> findByEmailOrderByUpdatedAtDesc(String email);

    List<Profile> findAllByOrderByUpdatedAtDesc();

    // User-specific queries
    List<Profile> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Profile> findTopByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Profile> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}
