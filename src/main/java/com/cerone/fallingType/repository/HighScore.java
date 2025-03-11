package com.cerone.fallingType.repository;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.NaturalId;

import java.time.LocalDateTime;

@Entity
@Table(name = "high_scores")
public class HighScore {

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(name="username")
    private String userName;

    @Getter
    @Setter
    @Column(name="score")
    private int score;

    @Getter
    @Setter
    @Column(name="timestamp")
    private LocalDateTime timeStamp;
}
