package org.oracle.globalpay.model;

import java.io.Serializable;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class Query implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String queryName;
	private String description;
	private String queryText;
	private String author;
	private Date lastUpdated;
	
	public String getQueryName() {
		return queryName;
	}
	public void setQueryName(String queryName) {
		this.queryName = queryName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getQueryText() {
		return queryText;
	}
	public void setQueryText(String queryText) {
		this.queryText = queryText;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public Date getLastUpdated() {
		return lastUpdated;
	}
	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	
	@Override
	public String toString() {
		return "Query [queryName=" + queryName + ", description=" + description + ", queryText="
				+ queryText + ", author=" + author + ", lastUpdated=" + lastUpdated + "]";
	}
}
