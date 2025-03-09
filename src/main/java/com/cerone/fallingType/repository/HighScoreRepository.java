package com.cerone.fallingType.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighScoreRepository extends JpaRepository<HighScore,Integer> {
    List<HighScore> findAll();
}
