package com.cerone.fallingType.repository;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue
    @Column(name="user_id")
    private int userId;

    @Getter
    @Setter
    @Column(name="name")
    private String userName;

    @Getter
    @Setter
    @Column(name="email_address")
    private String emailAddress;

}
