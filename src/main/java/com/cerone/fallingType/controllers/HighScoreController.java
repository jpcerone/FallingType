package com.cerone.fallingType.controllers;

import com.cerone.fallingType.repository.HighScore;
import com.cerone.fallingType.repository.HighScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;

@Controller
public class HighScoreController {

    @Autowired
    HighScoreRepository highScoreRepository;

    @GetMapping("/highscores")
    public String highScores(@RequestParam(name = "score", required = false, defaultValue = "0") String score, Model model) {
        List<HighScore> highScores = highScoreRepository.findAll();
        HighScoreComparator hsCompare = new HighScoreComparator();
        highScores.sort(hsCompare);

        model.addAttribute("newHighScore", score);
        model.addAttribute("highScores",highScores);
        return "highscorescreen";
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
