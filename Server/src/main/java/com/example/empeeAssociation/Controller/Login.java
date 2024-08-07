package com.example.empeeAssociation.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin; 

import com.example.empeeAssociation.Dao.UserLoginDetails;
import com.example.empeeAssociation.Service.LoginService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
public class Login {

    @Autowired
    LoginService loginService;

    @PostMapping("/userlogin")
    public ResponseEntity<String> loginUser(@RequestBody UserLoginDetails details) {
        try {
            if(loginService.checkUsernamePassword(details)){
                return ResponseEntity.ok("Login successful");
            } else {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }
}
