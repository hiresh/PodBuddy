package org.oracle.globalpay.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.oracle.globalpay.model.User;
import org.oracle.globalpay.serviceWrappers.Settable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	HashSet<User> users = new HashSet<>();
	@Value("${podbuddy.users.file}")
	String usersFile;
	@Autowired
	UtilityService utilityService;
	
	public void setUsers(HashSet<User> users) {
		this.users = users;
		
		
	}
	
	public boolean addUser(User user) {
		if(users.add(user)){
			saveToFile();
			return true;
		}
		return false;
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
	
	public HashSet<User> getAllUsers() {
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
