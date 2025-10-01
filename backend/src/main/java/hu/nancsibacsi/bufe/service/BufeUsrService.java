package hu.nancsibacsi.bufe.service;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;

@Service
public class BufeUsrService {
	private final BufeUsrRepository repository;

	public BufeUsrService(BufeUsrRepository repository) {
		this.repository = repository;
	}

    public BufeUsrEgyenlegResponse getEgyenleg(BufeUsr bufeUsr) {
        return new BufeUsrEgyenlegResponse(repository.getEgyenleg(bufeUsr.id()));
    }	
}