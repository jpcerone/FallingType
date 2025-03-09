package com.cerone.fallingType.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UsersTest {

    @Autowired
    UsersRepository repository;

    @Test
    void getUserName() {
        List<Users> users = repository.findByUserName("testUser");
    }

    @Test
    void getEmailAddress() {
    }

    @Test
    void setUserName() {
    }

    @Test
    void setEmailAddress() {
    }
}