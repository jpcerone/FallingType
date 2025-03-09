package com.cerone.fallingType.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class GameController {
    @PostMapping("/gameHealthCheck")
    public ResponseEntity<?> gameHealthCheck(HttpSession session, Integer score){
        if(session.getAttribute("score") == null){
            session.setAttribute("score",score);
            session.setAttribute("cheater",false);
        }else{
            Integer currentScore = (Integer)session.getAttribute("score");
            if(Math.abs(score - currentScore) > 13){
                session.setAttribute("cheater",true);
            }else{
                session.setAttribute("score",score);
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/newGame")
    public ResponseEntity<?> newGame(HttpSession session){
        session.setAttribute("score", 0);
        session.setAttribute("cheater",false);

        return ResponseEntity.ok().build();
    }
}
