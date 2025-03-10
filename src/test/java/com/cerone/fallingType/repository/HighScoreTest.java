package com.cerone.fallingType.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class HighScoreTest {

    @Autowired
    HighScoreRepository repository;

    @Test
    void getAllHighScores() {
        List<HighScore> scores = repository.findAll();
    }

    @Test
    void saveNewHighScore() {
        HighScore newHighScore = new HighScore();
        newHighScore.setUserName("Joe");
        newHighScore.setScore(1);
        newHighScore.setTimeStamp(LocalDateTime.now());
        repository.save(newHighScore);
    }

    @Test
    void setUserName() {
    }

    @Test
    void setEmailAddress() {
    }
}