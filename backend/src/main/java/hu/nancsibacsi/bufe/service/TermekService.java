package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.dto.BufeUsrTermekListaResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrTermekListaResponse.BufeTermek;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.exception.OutOfStockException;
import hu.nancsibacsi.bufe.model.Termek;
import hu.nancsibacsi.bufe.repository.TermekRepository;

@Service
public class TermekService {
	private final TermekRepository repository;

	public TermekService(TermekRepository repository) {
		this.repository = repository;
	}
	
	public Termek getById(Integer id) {
		return repository.findById(id)
				.orElseThrow( ()->new NotFoundException( "Ismeretlen termék: " + id ));
	}
	
	public Termek getByVonalkod(String vonalkod) {
		return repository.findByVonalkod(vonalkod)
				.orElseThrow( ()->new NotFoundException( "Ismeretlen vonalkód: " + vonalkod ));
	}
	
    public BufeUsrTermekListaResponse getListByBufeUsr(Integer bufeUsrId) {
        List<Object[]> rows = repository.getTermekListaByBufeUsr(bufeUsrId);
        return new BufeUsrTermekListaResponse(
        	rows.stream().map( r->
        		new BufeTermek( 
        			((Number)r[0]).intValue(), 
        			(String)r[1], 
        			((Number)r[2]).intValue(),
        			((Number)r[3]).intValue()) 
        	).toList()
        );
    }

    public BufeTermek getEar(Integer bufeUsrId, Integer termekId) {
        List<Object[]> rows = repository.getTermekEarByBufeUsr(bufeUsrId, termekId);
        if( rows.size()!=1 )
        	throw new OutOfStockException( "Egységár lekérdezési hiba!" );
        Object[] row=rows.get(0);
        return new BufeTermek( 
			((Number)row[0]).intValue(), 
			(String)row[1], 
			((Number)row[2]).intValue(),
			((Number)row[3]).intValue()
		); 
    }
    
	public List<Termek> getListByActive( boolean active, boolean demoMode ) {
		List<Termek> ret= demoMode
			? repository.findAllOrderByNevAscDemo( active ? "1" : "0" )
			: active
				? repository.findByAktivTrueOrderByNevAsc()
				: repository.findByAktivFalseOrderByNevAsc();
		return ret.stream().filter(t->t.id()>1).toList();
	}

	public Termek save(Termek termek) {
		return repository.save(termek);
	}
	public boolean hasNonDemoForgalom( Integer termekId ) {
		return repository.countNonDemoForgalomOfTermek( termekId )>0;
	}
}