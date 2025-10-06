package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.UsrRepository;

@Service
public class UsrService {
	private final UsrRepository repository;

	public UsrService(UsrRepository repository) {
		this.repository = repository;
	}

	public Usr getById(Integer id) {
		return repository.findById(id)
				.orElseThrow( ()->new NotFoundException( "Ismeretlen felhasználó: " + id ));
	}
	
	public List<Usr> getListByActive( boolean active ) {
		return active ? repository.findByAktivTrueOrderByNevAsc() : repository.findByAktivFalseOrderByNevAsc();
	}

	public Usr save(Usr usr) {
		return repository.save(usr);
	}
}
