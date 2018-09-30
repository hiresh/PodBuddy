package org.oracle.globalpay.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.oracle.globalpay.model.Query;
import org.oracle.globalpay.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QueryController {

	@Autowired
	QueryService queryService;
	
	@PostMapping(value="/query")
	public void addQuery(@RequestBody Query query) {
		queryService.addQuery(query);
	}
	
	@GetMapping(value="/queries")
	public List<Query> getAllQueries() {
		return queryService.getAllQueries();
	}
	
	@GetMapping(value="/query/{name}")
	public Query getQuery(@PathVariable String name) {
		return queryService.getQueryByName(name);
	}
	
	@GetMapping(value="/user/{name}/queries")
	public List<Query> getAllUserQueries(@PathVariable("name") String name) {
		return queryService.getQueriesByAuthor(name);
	}
	
	@GetMapping(value="/user/{name}/otherQueries")
	public List<Query> getQueriesByOtherAuthors(@PathVariable("name") String name) {
		return queryService.getQueriesNotAuthoredBy(name);
	}
	
	@GetMapping(value="/queries/{timeStamp}")
	public List<Query> getQueriesAfterTimestamp(@PathVariable("timeStamp") String timeStampString) {
		Date timeStamp;
		try {
			timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(timeStampString);
			return queryService.getQueriesUpdatedSinceTimestamp(timeStamp);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@GetMapping(value="/queries/load")
	public void loadFromFile() {
		queryService.loadFromFile();
	}

}
