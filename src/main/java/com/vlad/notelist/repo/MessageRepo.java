package com.vlad.notelist.repo;

import com.vlad.notelist.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {
    List<Message> findByUserId(String id);
}
