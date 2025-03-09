package com.cerone.fallingType.controllers;

import com.cerone.fallingType.repository.HighScore;
import com.cerone.fallingType.repository.HighScoreRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Controller
public class HighScoreController {

    @Autowired
    HighScoreRepository highScoreRepository;

    @GetMapping("/highscores")
    public String highScores(Model model) {
        List<HighScore> highScores = highScoreRepository.findAll();
        HighScoreComparator hsCompare = new HighScoreComparator();
        highScores.sort(hsCompare);
        model.addAttribute("highScores",highScores);
        return "highscorescreen";
    }

    @PostMapping("/saveHighScore")
    public String saveHighScore(HttpSession session,Model model, String userName){
        if(session.getAttribute("score") != null && session.getAttribute("cheater") != null && !((boolean) session.getAttribute("cheater"))){
            HighScore newHighScore = new HighScore();
            newHighScore.setScore((Integer)session.getAttribute("score"));
            newHighScore.setUserName(userName);
            newHighScore.setTimeStamp(LocalDateTime.now());
            highScoreRepository.save(newHighScore);
        }
        return highScores(model);
    }

    public static class HighScoreComparator implements Comparator<HighScore> {
        @Override
        public int compare(HighScore hs1, HighScore hs2) {
            if (hs1.getScore() > hs2.getScore())
                return -1;
            else if (hs1.getScore() < hs2.getScore())
                return +1;
            else
                return 0;
        }
    }
}
