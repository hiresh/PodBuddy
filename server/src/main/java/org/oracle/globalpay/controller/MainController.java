package org.oracle.globalpay.controller;

import java.util.List;

import org.oracle.globalpay.model.UserQuery;
import org.oracle.globalpay.service.UtilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
	
	@Autowired
	UtilityService utilityService;
	
	@GetMapping("/")
	public String getUsers() {
		return "Welcome to podbuddy services";
	}
	
	@GetMapping("/userQueries")
	public List<UserQuery> getUserQueries() {
		return utilityService.getUserQueries();
	}
}
