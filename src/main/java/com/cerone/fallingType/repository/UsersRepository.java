package com.cerone.fallingType.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    List<Users> findByUserName(String userName);

    Users findByUserId(int userId);

}
