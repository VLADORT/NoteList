package com.vlad.notelist.repo;

import com.vlad.notelist.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepo extends JpaRepository<User, String> {
}
