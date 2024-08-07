package com.example.empeeAssociation.Service;

import org.springframework.stereotype.Service;
import com.example.empeeAssociation.Dao.UserLoginDetails;

@Service
public class LoginService {
    public boolean checkUsernamePassword(UserLoginDetails details){
        // Compare strings using equals() method
        return "admin".equals(details.getUsername()) && "aaaa".equals(details.getPassword());
    }
}
