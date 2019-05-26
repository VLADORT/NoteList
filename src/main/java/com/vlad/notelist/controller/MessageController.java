package com.vlad.notelist.controller;

import com.fasterxml.jackson.annotation.JsonView;

import com.vlad.notelist.domain.Message;
import com.vlad.notelist.domain.User;
import com.vlad.notelist.domain.Views;
import com.vlad.notelist.exceptions.NotFoundException;
import com.vlad.notelist.repo.MessageRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("message")
public class MessageController {
    private final MessageRepo messageRepo;

    @Autowired
    public MessageController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<Message> list(@AuthenticationPrincipal User user) {
        return messageRepo.findByUserId(user.getId());
    }



    @GetMapping("{id}")
    @JsonView(Views.FullMessage.class)

    public String getOne(@PathVariable("id") Message message) {
        try {
        return message.getText()+"    "+ message.getTag();}
        catch (NullPointerException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Not Found", e);
        }
    }

    @PostMapping
    public Message create(@RequestBody Message message, @AuthenticationPrincipal User user) {
        message.setCreationDate(LocalDateTime.now());
        message.setUserId(user.getId());
        return messageRepo.save(message);
    }

    @PutMapping("{id}")
    public Message update(
            @PathVariable("id") Message messageFromDb,
            @RequestBody Message message
    ) {
        BeanUtils.copyProperties(message, messageFromDb, "id");

        return messageRepo.save(messageFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message) {
        messageRepo.delete(message);
    }
}
