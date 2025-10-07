package hu.nancsibacsi.bufe.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.dto.EgyenlegResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse.BufeUsrEgyenleg;
import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse.BufeUsrRelation;
import hu.nancsibacsi.bufe.dto.UsrBufeRelationResponse;
import hu.nancsibacsi.bufe.dto.UsrBufeRelationResponse.UsrBufeRelation;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.model.BufeForgalom;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.MuveletTipus;
import hu.nancsibacsi.bufe.model.Termek;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.BufeForgalomRepository;
import hu.nancsibacsi.bufe.repository.BufeRepository;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;
import hu.nancsibacsi.bufe.repository.TermekRepository;
import hu.nancsibacsi.bufe.repository.UsrRepository;
import hu.nancsibacsi.bufe.util.Conv;

@Service
public class BufeUsrService {
	private final BufeUsrRepository repository;
	private final BufeRepository bufeRepository;
	private final UsrRepository usrRepository;
	private final TermekRepository termekRepository;
	private final BufeForgalomRepository bufeForgalomRepository;

	public BufeUsrService(BufeUsrRepository repository, BufeRepository bufeRepository, UsrRepository usrRepository,
			TermekRepository termekRepository, BufeForgalomRepository bufeForgalomRepository ) {
		this.repository = repository;
		this.bufeRepository = bufeRepository;
		this.usrRepository = usrRepository;
		this.termekRepository = termekRepository;
		this.bufeForgalomRepository = bufeForgalomRepository;
	}

    public EgyenlegResponse getEgyenleg(Integer bufeUsrId) {
        return new EgyenlegResponse(repository.getEgyenleg(bufeUsrId));
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
			.orElseThrow(()->new NotFoundException( "Ismeretlen büfé felhasználó: " + bufeUsrId ));
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
	public BufeUsrEgyenlegResponse getListEgyenleg( Integer bufeId ) {
		List<Object[]> rows = repository.findBufeBufeEgyenleg(bufeId);
        return new BufeUsrEgyenlegResponse( rows.stream().map( r->
			new BufeUsrEgyenleg(
				Conv.toInt(r[0]),
				(String)r[1],
				Conv.toInt(r[2]),
				0
			)
		).toList() );		
	}
	public void addEgyenleg( Bufe bufe, Integer bufeUsrId, Integer feltoltes ) {
		BufeUsr bu=repository.findById(bufeUsrId)
			.orElseThrow(()->new NotFoundException( "Ismeretlen büfé felhasználó: " + bufeUsrId ));
		if( !bufe.id().equals( bu.bufe().id() ) )
			throw new NotFoundException( "Hiányzó büfé-felhasználó összerendelés: " + bufe.nev() + "/" + bu.usr().nev() );
		Termek kp=termekRepository.findById(1)
			.orElseThrow(()->new NotFoundException( "A készpénz termék nem található!: " + 1 ));
		BufeForgalom bf=new BufeForgalom();
		bf.at( new Date() );
		bf.bufe( bufe );
		bf.bufeUsr( bu );
		bf.ear(1);
		bf.mennyiseg(feltoltes);
		bf.muvelet(MuveletTipus.VASARLOI_BEFIZETES.getCode());
		bf.termek(kp);
		bf.usrValtozas(feltoltes);
		bf.valtozas(feltoltes);
		bufeForgalomRepository.save( bf );
	}
}