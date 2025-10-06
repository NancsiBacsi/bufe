package hu.nancsibacsi.bufe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse.BufeUsrRelation;
import hu.nancsibacsi.bufe.dto.UsrBufeRelationResponse;
import hu.nancsibacsi.bufe.dto.UsrBufeRelationResponse.UsrBufeRelation;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.BufeRepository;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;
import hu.nancsibacsi.bufe.repository.UsrRepository;
import hu.nancsibacsi.bufe.util.Conv;

@Service
public class BufeUsrService {
	private final BufeUsrRepository repository;
	private final BufeRepository bufeRepository;
	private final UsrRepository usrRepository;

	public BufeUsrService(BufeUsrRepository repository, BufeRepository bufeRepository, UsrRepository usrRepository ) {
		this.repository = repository;
		this.bufeRepository = bufeRepository;
		this.usrRepository = usrRepository;
	}

    public BufeUsrEgyenlegResponse getEgyenleg(BufeUsr bufeUsr) {
        return new BufeUsrEgyenlegResponse(repository.getEgyenleg(bufeUsr.id()));
    }
    
    public BufeUsr getById( Integer id ) {
    	return repository.findById( id )
    		.orElseThrow( ()->new NotFoundException( "Ismeretlen büfé felhasználó: " + id ));
    }
	public BufeUsr add(Integer bufeId, Integer usrId ) {
		Bufe bufe=bufeRepository.findById( bufeId )
			.orElseThrow( ()->new NotFoundException( "Ismeretlen büfé: " + bufeId ));
		Usr usr=usrRepository.findById( usrId )
				.orElseThrow( ()->new NotFoundException( "Ismeretlen felhasználó: " + usrId ));
		BufeUsr bu=new BufeUsr();
		bu.aktiv(true);
		bu.bufe( bufe );
		bu.hitelKeret(0);
		bu.minusArres(20);
		bu.penztaros(false);
		bu.plusArres(10);
		bu.usr(usr);
		return repository.save(bu);
	}    
	public BufeUsr setActive(Integer bufeUsrId, Boolean active ) {
		BufeUsr bu=repository.findById( bufeUsrId )
			.orElseThrow( ()->new NotFoundException( "Ismeretlen büfé felhasználó: " + bufeUsrId ));
		bu.aktiv(active);
		return repository.save(bu);
	}    
	public BufeUsr save(BufeUsr bufeUsr) {
		return repository.save(bufeUsr);
	}
	public UsrBufeRelationResponse getListByBufe( Integer bufeId ) {
        List<Object[]> rows = repository.findUsrBufeUsrRelations(bufeId);
        return new UsrBufeRelationResponse( rows.stream().map( r->
        			new UsrBufeRelation(
        				Conv.toInt(r[0]),
        				(String)r[1],
        				Conv.toInt(r[2]),
        				"1".equals( r[3].toString() ) 
        			)
        		).toList() );
	}
	public BufeUsrRelationResponse getListByUsr( Integer usrId ) {
        List<Object[]> rows = repository.findBufeBufeUsrRelations(usrId);
        return new BufeUsrRelationResponse( rows.stream().map( r->
        			new BufeUsrRelation(
        				Conv.toInt(r[0]),
        				(String)r[1],
        				Conv.toInt(r[2]),
        				"1".equals( r[3].toString() ) 
        			)
        		).toList() );
	}
}