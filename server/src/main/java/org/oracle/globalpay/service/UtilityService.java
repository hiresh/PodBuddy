package org.oracle.globalpay.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.oracle.globalpay.model.UserQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UtilityService {

	@Autowired
	QueryService queryService;
	@Autowired
	UserService userService;
	
	public Date getMaxUpdDate() {
		return queryService.getMaxUpdDate();
	}
	
	public List<UserQuery> getUserQueries() {
		List<UserQuery> userQueries = new ArrayList<>();
		(queryService.getUsers()).forEach(u -> {
			UserQuery userQuery = new UserQuery();
			userQuery.setUser(userService.getUser(u));
			userQuery.setQueries(queryService.getQueriesByAuthor(u));
			userQueries.add(userQuery);
		});
		return userQueries;
	}	
}
