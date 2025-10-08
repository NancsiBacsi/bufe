package hu.nancsibacsi.bufe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BoltFeltoltesRequest;
import hu.nancsibacsi.bufe.dto.ForgalomLogResponse;
import hu.nancsibacsi.bufe.dto.TermekEgysegarResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeForgalomService;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/forgalom")
public class BufeForgalomController extends SessionController {
	private final BufeForgalomService bufeForgalomService;

	public BufeForgalomController(BufeUsrService bufeUsrService, BufeForgalomService bufeForgalomService) {
		super(bufeUsrService);
		this.bufeForgalomService = bufeForgalomService;
	}

	@PostMapping("/vasarlas/{termekId}")
	public ResponseEntity<Void> vasarlasByTermekId(@PathVariable Integer termekId, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		bufeForgalomService.vasarlasByTermekId(bufeUsr, termekId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/vasarlasbyvonalkod/{vonalkod}")
	public ResponseEntity<Void> vasarlasByVonalkod(@PathVariable String vonalkod, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		bufeForgalomService.vasarlasByVonalkod(bufeUsr, vonalkod);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/vasarlasnaplo/{bufeUsrId}")
	public ForgalomLogResponse getLogByBufeUsrId(@PathVariable Integer bufeUsrId) {
		return bufeForgalomService.getListByBufeUsrId(bufeUsrId);
	}

	@PostMapping("/vasarlasstorno/{bufeForgalomId}")
	public ResponseEntity<Void> vasarlasStorno(@PathVariable Integer bufeForgalomId, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		bufeForgalomService.vasarlasStorno(bufeUsr, bufeForgalomId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/listear")
	public TermekEgysegarResponse getListEar(HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		if (!bufeUsr.penztaros())
			throw new AuthenticationException("Pénztáros jogosultság szükséges!");
		return bufeForgalomService.getListEar(bufeUsr.bufe().id());
	}

	@PostMapping("/boltfeltoltes")
	public ResponseEntity<Void> boltfeltoltes(@RequestBody BoltFeltoltesRequest req, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		if (!bufeUsr.penztaros())
			throw new AuthenticationException("Pénztáros jogosultság szükséges!");
		bufeForgalomService.boltFeltoltes(bufeUsr.bufe().id(), req.termekek());
		return ResponseEntity.noContent().build();
	}
}