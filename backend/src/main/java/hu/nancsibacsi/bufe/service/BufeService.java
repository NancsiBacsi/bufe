package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.repository.BufeRepository;

@Service
public class BufeService {
	private final BufeRepository repository;

	public BufeService(BufeRepository repository) {
		this.repository = repository;
	}

	public List<Bufe> getListByActive( boolean active ) {
		return active ? repository.findByAktivTrueOrderByNevAsc() : repository.findByAktivFalseOrderByNevAsc();
	}
	public Bufe getById(Integer id) {
		return repository.findById(id).orElse(null);
	}

	public Bufe save(Bufe bufe) {
		return repository.save(bufe);
	}
}