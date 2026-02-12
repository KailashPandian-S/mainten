package com.project.mainten.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.project.mainten.model.Organisation;
import com.project.mainten.service.AuthenticationService;
import com.project.mainten.model.User;

@CrossOrigin(origins = "*")
@RestController
public class AuthController {

    @Autowired
    private AuthenticationService s;

    @PostMapping("/auth/org/login")
    public String loginOrganisation(@RequestBody Organisation org) {
       return  s.loginOrganisation(org);
    }

    @PostMapping("/auth/org/register")
    public String registerOrganisation(@RequestBody Organisation org) {
        return s.registerOrganisation(org);
    }

    @PostMapping("/auth/user/login")
    public String loginUser(@RequestBody User user) {
        return s.loginUser(user);
    }

    @PostMapping("/auth/user/register")
    public String registerUser(@RequestBody User user) {
         return s.registerUser(user);
    }


}
