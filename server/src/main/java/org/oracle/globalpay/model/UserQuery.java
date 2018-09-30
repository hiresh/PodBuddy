package org.oracle.globalpay.model;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class UserQuery {
	User user;
	List<Query> queries;
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public List<Query> getQueries() {
		return queries;
	}
	public void setQueries(List<Query> queries) {
		this.queries = queries;
	}
}
