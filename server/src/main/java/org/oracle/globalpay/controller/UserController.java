package org.oracle.globalpay.controller;

import java.util.List;

import org.oracle.globalpay.model.User;
import org.oracle.globalpay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
	
	@Autowired
	UserService userService;	
	
	@GetMapping("/users")
	public List<User> getUsers() {
		return userService.getAllUsers();
	}
	
	@GetMapping("/user/{name}")
	public User getUser(@PathVariable("name") String name) {
		return userService.getUser(name);
	}
	
	@PostMapping(value="/user", consumes="application/json")
	public void addUser(@RequestBody User user) {		
		userService.addUser(user);
	}
	
	@DeleteMapping(value="/user/{name}")
	public void deleteUser(@PathVariable String name) {
		userService.removeUser(userService.getUser(name));
	}	
}
