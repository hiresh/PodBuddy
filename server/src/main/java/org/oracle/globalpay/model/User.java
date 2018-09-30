package org.oracle.globalpay.model;

import java.io.Serializable;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class User implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String registeredName;
	private Date lastRequest;
	
	public String getRegisteredName() {
		return registeredName;
	}
	public void setRegisteredName(String registeredName) {
		this.registeredName = registeredName;
	}
	public Date getLastRequest() {
		return lastRequest;
	}
	public void setLastRequest(Date lastRequest) {
		this.lastRequest = lastRequest;
	}
	
	@Override
	public String toString() {
		return "User [registeredName=" + registeredName + ", lastRequest=" + lastRequest + "]";
	}
}
