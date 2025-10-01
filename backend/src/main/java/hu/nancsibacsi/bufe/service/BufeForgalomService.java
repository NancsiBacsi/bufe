package hu.nancsibacsi.bufe.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.nancsibacsi.bufe.dto.BufeUsrTermekListaResponse.BufeTermek;
import hu.nancsibacsi.bufe.dto.ForgalomLogResponse;
import hu.nancsibacsi.bufe.dto.ForgalomLogResponse.ForgalomLogItem;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.model.BufeForgalom;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.MuveletTipus;
import hu.nancsibacsi.bufe.model.Termek;
import hu.nancsibacsi.bufe.repository.BufeForgalomRepository;

@Service
public class BufeForgalomService {
	private final BufeForgalomRepository repository;
	private final TermekService termekService;
	public BufeForgalomService(BufeForgalomRepository repository, TermekService termekService) {
		this.repository = repository;
		this.termekService = termekService;
	}

	public ForgalomLogResponse getLogByBufeUsrId( Integer bufeUsrId ) {
		List<Object[]> rows = repository.getLogByBufeUsrId(bufeUsrId);
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
		return repository.save(forgalom);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasByTermekId(BufeUsr bufeUsr, Integer termekId) {
		Termek termek = termekService.getTermekById(termekId);
		vasarlas(bufeUsr, termek);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasByVonalkod(BufeUsr bufeUsr, String vonalkod) {
		Termek termek = termekService.findTermekByVonalkod(vonalkod);
		vasarlas(bufeUsr, termek);
	}

	private void vasarlas(BufeUsr bufeUsr, Termek termek) {
		BufeTermek ear = termekService.getTermekEar(bufeUsr.id(), termek.id());
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
		repository.save(bf);
	}
	@Transactional(rollbackFor = Exception.class)
	public void vasarlasStorno( BufeUsr bufeUsr, Integer bufeForgalomId ) {
		BufeForgalom bf=repository.findById( bufeForgalomId )
				.orElseThrow( () -> new NotFoundException( "Ismeretlen forgalom azonosító: " + bufeForgalomId ));
		if( !bf.bufeUsr().id().equals( bufeUsr.id() ) )
			throw new NotFoundException( "A stornozandó vásárlás " + bf.bufeUsr().usr().nev() + " felhasználóhoz tartozik!" );
		bf.ear(0);
		bf.mennyiseg(0);
		bf.valtozas(0);
		bf.usrValtozas(0);
		repository.save(bf);
	}
	
	/*public List<BufeForgalom> getByBufeId(Integer bufeId) {
		return repository.findByBufeId(bufeId);
	}

	public List<BufeForgalom> getByTermekId(Integer termekId) {
		return repository.findByTermekId(termekId);
	}

	*/
}