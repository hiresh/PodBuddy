package org.oracle.globalpay.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.oracle.globalpay.model.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

@Service
@PropertySource("classpath:custom.properties")
public class QueryService  {

	private List<Query> queries = new ArrayList<>();
	@Value("${podbuddy.queries.file}")
	String queriesFile;
	@Autowired
	UtilityService utilityService;

	public void setQueries(List<Query> queries) {
		this.queries = queries;
	}
	
	public void addQuery(Query query) {
		queries.add(query);
		saveToFile();
	}

	public void removeQuery(Query query) {
		queries.remove(query);
		saveToFile();
	}

	public Query getQueryByName(String name) {
		return queries.stream().filter(q -> q.getQueryName().equals(name)).findFirst().get();
	}

	public List<Query> getQueriesByAuthor(String author) {
		List<Query> userQueries = new ArrayList<>();
		for (Query query : queries) {
			if (author!=null&&query.getAuthor()!=null&&query.getAuthor().equals(author)) {
				userQueries.add(query);
			}
		}
		return userQueries;
	}

	public List<Query> getQueriesNotAuthoredBy(String author) {
		List<Query> userQueries = new ArrayList<>();
		for (Query query : queries) {
			if (!query.getAuthor().equals(author)) {
				userQueries.add(query);
			}
		}
		return userQueries;
	}

	public List<Query> getQueriesUpdatedSinceTimestamp(Date timeStamp) {
		List<Query> userQueries = new ArrayList<>();
		for (Query query : queries) {
			if (query.getLastUpdated().after(timeStamp)) {
				userQueries.add(query);
			}
		}
		return userQueries;
	}

	public List<Query> getAllQueries() {
		return queries;
	}
	
	public List<String> getUsers() {
		List<String> users = new ArrayList<>();
		for (Query query : queries) {
			if (!users.contains(query.getAuthor())) {
				users.add(query.getAuthor());
			}
		}
		return users;
	}

	public void updateQuery(String name, Query query) {
		queries.remove(getQueryByName(name));
		queries.add(query);
		saveToFile();
	}

	public Date getMaxUpdDate() {
		Date maxDate = null;
		try {
			maxDate = new SimpleDateFormat("yyyy-MM-dd").parse("0001-01-01");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		for (Query query : queries) {
			if (query.getLastUpdated().after(maxDate)) {
				maxDate = query.getLastUpdated();
			}
		}
		return maxDate;
	}
	
	public void saveToFile() {
		IOService.saveToFile(queries, queriesFile);
	} 

	@PostConstruct
	public void loadFromFile() {
		IOService.loadFromFile((new Query()), queriesFile, this);
	}

	
}
