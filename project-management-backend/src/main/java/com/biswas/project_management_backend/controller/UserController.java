package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/company/{companyId}")
    public List<UserDto> getAllUsers(@PathVariable Long companyId){
        return userService.getAllUsers(companyId);
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id){
        return userService.getUser(id);
    }

}
