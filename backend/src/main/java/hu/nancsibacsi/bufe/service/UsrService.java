package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;
import hu.nancsibacsi.bufe.repository.UsrRepository;

@Service
public class UsrService {
	public static final int DEMO_ADMIN=20001;
	private final UsrRepository repository;
	private final BufeUsrRepository bufeUsrRepository;

	public UsrService(UsrRepository repository, BufeUsrRepository bufeUsrRepository) {
		this.repository = repository;
		this.bufeUsrRepository = bufeUsrRepository;
	}

	public Usr getById(Integer id, boolean demoMode) {
		Usr ret=repository.findById(id)
				.orElseThrow( ()->new NotFoundException( "Ismeretlen felhasználó: " + id ));
		if( demoMode ) {
			List<BufeUsr> bus=bufeUsrRepository.findByUsrIdWithBufe( id );
			if( bus.stream().filter( bu->bu.bufe().id()<BufeService.DEMO_BUFE ).count()>0 )
				throw new AuthenticationException( "Demó számára tiltott művelet!" );
		}
		return ret;
	}
	
	public List<Usr> getListByActive( boolean active, boolean demoMode ) {
		return demoMode
				? repository.findByAktivOrderByNevAscDemo( active ? "1" : "0" )
				: active
					? repository.findByAktivTrueOrderByNevAsc()
					: repository.findByAktivFalseOrderByNevAsc();
	}

	public Usr save(Usr usr) {
		return repository.save(usr);
	}
}
