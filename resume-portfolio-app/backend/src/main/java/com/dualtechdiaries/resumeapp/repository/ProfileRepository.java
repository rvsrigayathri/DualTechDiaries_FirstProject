package com.dualtechdiaries.resumeapp.repository;

import com.dualtechdiaries.resumeapp.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Profile entities.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findTopByOrderByUpdatedAtDesc();

    List<Profile> findByEmailOrderByUpdatedAtDesc(String email);

    List<Profile> findAllByOrderByUpdatedAtDesc();
}
