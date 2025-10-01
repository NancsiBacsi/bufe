package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.UsrRepository;

@Service
public class UsrService {
	private final UsrRepository repository;

	public UsrService(UsrRepository repository) {
		this.repository = repository;
	}

	public List<Usr> getAllUsr() {
		return repository.findAll();
	}
	
	public List<Usr> getAllUsrOfBufe( Integer bufeId, boolean active ) {
		return repository.findAllWithBufe( bufeId, active );
	}
}
