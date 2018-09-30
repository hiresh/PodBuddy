package org.oracle.globalpay.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.oracle.globalpay.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	List<User> users = new ArrayList<>();
	@Value("${podbuddy.users.file}")
	String usersFile;
	@Autowired
	UtilityService utilityService;
	
	public void setUsers(List<User> users) {
		this.users = users;
	}
	
	public void addUser(User user) {
		users.add(user);
		saveToFile();
		
	}
	
	public void removeUser(User user) {
		users.remove(user);
		saveToFile();
	}
	
	public User getUser(String registeredName) {
		return users.stream().filter(s -> s.getRegisteredName().equals(registeredName))
				.findAny().orElse(null);
	}
	
	public void updateUser(String registeredName, User user) {
		users.remove(getUser(registeredName));
		users.add(user);
		saveToFile();
	}
	
	public List<User> getAllUsers() {
		return users;
	}
	
	public void saveToFile() {
		IOService.saveToFile(users, usersFile);
	} 

	@PostConstruct
	public void loadFromFile() {
		IOService.loadFromFile((new User()), usersFile, this);
	}
}
