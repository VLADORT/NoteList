package com.vlad.notelist.controller;


import com.vlad.notelist.domain.User;
import com.vlad.notelist.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
@RequestMapping("/")
public class MainController {
    private final MessageRepo messageRepo;

    @Autowired
    public MainController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @GetMapping
    public String main(Model model, @AuthenticationPrincipal User user) {
        HashMap<Object, Object> data = new HashMap<>();

        data.put("profile", user);
        try {
                data.put("messages", messageRepo.findByUserId(user.getId()));

        } catch (NullPointerException e) {
            data.put("messages", messageRepo.findAll());
        }

        model.addAttribute("frontendData", data);

        return "index";
    }
}
