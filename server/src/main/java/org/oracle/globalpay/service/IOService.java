package org.oracle.globalpay.service;

import java.io.EOFException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.List;

import org.oracle.globalpay.model.Query;
import org.oracle.globalpay.model.User;

public class IOService {

	public static void saveToFile(Object obj, String filePath) {
		try {
			
			File file = new File(filePath);
			OutputStream os = new FileOutputStream(file);
			ObjectOutputStream oos = new ObjectOutputStream(os);			
			oos.writeObject(obj);			
			oos.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	} 

	@SuppressWarnings("unchecked")
	public static void loadFromFile(Object type, String filePath, Object objService) {

		try {
			File file = new File(filePath);
			FileInputStream fis = new FileInputStream(file);
			@SuppressWarnings("resource")
			ObjectInputStream ois = new ObjectInputStream(fis);

			Object obj = ois.readObject();
			
			if (type instanceof User) {
				((UserService)objService).setUsers((List<User>)obj);
			}
			else if (type instanceof Query) {
				((QueryService)objService).setQueries((List<Query>)obj);
			}
			
			// queries = (List<Query>) ois.readObject();

		} catch (IOException | ClassNotFoundException e) {
			if (e instanceof EOFException) {
				System.out.println("EOF while reading query objects");
			} else
				e.printStackTrace();
		}

	}
}
