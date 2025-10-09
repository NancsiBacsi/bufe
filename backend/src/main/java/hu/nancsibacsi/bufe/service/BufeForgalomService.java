package hu.nancsibacsi.bufe.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import hu.nancsibacsi.bufe.dto.BevasarloListaResponse;
import hu.nancsibacsi.bufe.dto.BevasarloListaResponse.BevasarloListaItem;
import hu.nancsibacsi.bufe.dto.BoltFeltoltesRequest.BoltFeltoltes;
import hu.nancsibacsi.bufe.dto.BufeUsrTermekListaResponse.BufeTermek;
import hu.nancsibacsi.bufe.dto.ForgalomLogResponse;
import hu.nancsibacsi.bufe.dto.ForgalomLogResponse.ForgalomLogItem;
import hu.nancsibacsi.bufe.dto.LeltarRequest.LeltarTermekMennyiseg;
import hu.nancsibacsi.bufe.dto.TermekEgysegarResponse;
import hu.nancsibacsi.bufe.dto.TermekEgysegarResponse.TermekEgysegar;
import hu.nancsibacsi.bufe.dto.TermekMennyisegResponse;
import hu.nancsibacsi.bufe.dto.TermekMennyisegResponse.TermekMennyiseg;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.model.BufeForgalom;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.MuveletTipus;
import hu.nancsibacsi.bufe.model.Termek;
import hu.nancsibacsi.bufe.repository.BufeForgalomRepository;
import hu.nancsibacsi.bufe.util.Conv;

@Service
public class BufeForgalomService {
	private final BufeForgalomRepository bufeForgalomRepository;
	private final TermekService termekService;
	public BufeForgalomService(BufeForgalomRepository repository, TermekService termekService) {
		this.bufeForgalomRepository = repository;
		this.termekService = termekService;
	}

	public ForgalomLogResponse getListByBufeUsrId( Integer bufeUsrId ) {
		List<Object[]> rows = bufeForgalomRepository.getLogByBufeUsrId(bufeUsrId);
		return new ForgalomLogResponse( rows.stream().map( r->
				new ForgalomLogItem(
					((Number)r[0]).intValue(),
					((Number)r[1]).intValue(),
					(String)r[2],
					((Number)r[3]).intValue(),
					((Number)r[4]).intValue(),
					(String)r[5]
				)
			).toList()
		);
	}
	public BufeForgalom save(BufeForgalom forgalom) {
		return bufeForgalomRepository.save(forgalom);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasByTermekId(BufeUsr bufeUsr, Integer termekId) {
		Termek termek = termekService.getById(termekId);
		vasarlas(bufeUsr, termek);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasByVonalkod(BufeUsr bufeUsr, String vonalkod) {
		Termek termek = termekService.getByVonalkod(vonalkod);
		vasarlas(bufeUsr, termek);
	}

	private void vasarlas(BufeUsr bufeUsr, Termek termek) {
		BufeTermek ear = termekService.getEar(bufeUsr.id(), termek.id());
		BufeForgalom bf = new BufeForgalom();
		bf.at(new Date());
		bf.bufe(bufeUsr.bufe());
		bf.bufeUsr(bufeUsr);
		bf.ear(ear.beszerzesiEar());
		bf.mennyiseg(-1);
		bf.muvelet(MuveletTipus.VASARLAS.getCode());
		bf.termek(termek);
		bf.usrValtozas(MuveletTipus.VASARLAS.getElojel() * ear.ear());
		bf.valtozas(MuveletTipus.VASARLAS.getElojel() * ear.beszerzesiEar());
		bufeForgalomRepository.save(bf);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasStorno( BufeUsr bufeUsr, Integer bufeForgalomId ) {
		BufeForgalom bf=bufeForgalomRepository.findById( bufeForgalomId )
				.orElseThrow( () -> new NotFoundException( "Ismeretlen forgalom azonosító: " + bufeForgalomId ));
		if( !bf.bufeUsr().id().equals( bufeUsr.id() ) )
			throw new NotFoundException( "A stornozandó vásárlás " + bf.bufeUsr().usr().nev() + " felhasználóhoz tartozik!" );
		bf.ear(0);
		bf.mennyiseg(0);
		bf.valtozas(0);
		bf.usrValtozas(0);
		bufeForgalomRepository.save(bf);
	}
	
	public TermekEgysegarResponse getListEar( Integer bufeId ) {
		List<Object[]> rows = bufeForgalomRepository.getListEar(bufeId);
        return new TermekEgysegarResponse( rows.stream().map( r->
			new TermekEgysegar(
				Conv.toInt(r[0]),
				(String)r[1],
				Conv.toInt(r[2]),
				0
			)
		).toList() );
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void boltFeltoltes( Integer bufeId, List<BoltFeltoltes> termekek ) {
		Bufe b=new Bufe();
		b.id( bufeId );
		ArrayList<BufeForgalom> bfs=new ArrayList<>();
		for( BoltFeltoltes f:termekek ) {
			BufeForgalom bf=new BufeForgalom();
			bf.at( new Date() );
			bf.bufe( b );
			bf.ear( f.ear() );
			bf.mennyiseg( f.mennyiseg() );
			bf.muvelet( MuveletTipus.ARUBESZERZES.getCode() );
			Termek t=new Termek();
			t.id( f.termekId() );
			bf.termek( t );
			bf.valtozas( f.ear()*f.mennyiseg() );
			bfs.add( bf );
		}
		bufeForgalomRepository.saveAll( bfs );		
	}
	
	public TermekMennyisegResponse getListMennyiseg( Integer bufeId ) {
		List<Object[]> rows = bufeForgalomRepository.getListMennyiseg(bufeId);
        return new TermekMennyisegResponse( rows.stream().map( r->
			new TermekMennyiseg(
				Conv.toInt(r[0]),
				(String)r[1],
				Conv.toInt(r[2]),
				Conv.toInt(r[3]),
				Conv.toInt(r[3])
			)
		).toList() );
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void leltar( Integer bufeId, List<LeltarTermekMennyiseg> termekek ) {
		List<Map<String, Integer>> talaltMennyisegek = termekek.stream()
		    .map(t -> Map.of(
		        "termek_id", t.termekId(),
		        "mennyiseg", t.talaltMennyiseg()
		    )).toList();
		String talaltMennyisegekJSON=null;
		try {
			talaltMennyisegekJSON = new ObjectMapper().writeValueAsString(talaltMennyisegek);
		} catch( Exception e ) {
			throw new RuntimeException( "JSON serializációs hiba." );
		}
		List<Object[]> rows = bufeForgalomRepository.getLeltarTobbletHiany( bufeId, talaltMennyisegekJSON );
		Bufe b=new Bufe();
		b.id( bufeId );
		List<BufeForgalom> bfs=new ArrayList<BufeForgalom>();
		for( Object[] r:rows ) {
			BufeForgalom bf=new BufeForgalom();
			Termek t=new Termek();
			t.id(Conv.toInt(r[0]));
			bf.termek( t );
			Integer mennyiseg=Conv.toInt(r[1]);
			if( mennyiseg!=null && mennyiseg!=0 ) {
				bf.mennyiseg( mennyiseg );
				bf.muvelet( mennyiseg>0 ? MuveletTipus.LELTAR_TOBBLET.getCode() : MuveletTipus.LELTAR_HIANY.getCode() );
				bf.ear(Conv.toInt(r[2]));
				bf.valtozas( bf.mennyiseg()*bf.ear() );
				bf.bufe( b );
				bf.at( new Date() );
				bfs.add( bf );
			}
		}
		if( bfs.size()>0 )
			bufeForgalomRepository.saveAll( bfs );		
	}
	
	public BevasarloListaResponse getBevasarloLista( Integer bufeId, Integer multNapok, Integer jovoNapok ) {
		List<Object[]> rows = bufeForgalomRepository.getBevasarloLista(bufeId, multNapok, jovoNapok);
        return new BevasarloListaResponse( rows.stream().map( r->
			new BevasarloListaItem(
				Conv.toInt(r[0]),
				(String)r[1],
				Conv.toInt(r[2]),
				false
			)
		).toList() );
	}
}