package hu.nancsibacsi.bufe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.ForgalomLogResponse;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeForgalomService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/forgalom")
public class BufeForgalomController extends SessionController {
	private final BufeForgalomService service;

	public BufeForgalomController(BufeForgalomService service) {
		this.service = service;
	}
	
	@PostMapping("/vasarlas/{termekId}")
	public void vasarlasByTermekId(@PathVariable Integer termekId, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr=getBufeUsr(httpRequest);
		service.vasarlasByTermekId(bufeUsr, termekId );
	}
    
	@PostMapping("/vasarlasbyvonalkod/{vonalkod}")
	public void vasarlasByVonalkod(@PathVariable String vonalkod, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr=getBufeUsr(httpRequest);
		service.vasarlasByVonalkod(bufeUsr, vonalkod);
	}	

	@PostMapping("/vasarlasnaplo/{bufeUsrId}")
    public ResponseEntity<ForgalomLogResponse> getLogByBufeUsrId(@PathVariable Integer bufeUsrId) {
        return ResponseEntity.ok(service.getLogByBufeUsrId(bufeUsrId));
    }
    
	@PostMapping("/vasarlasstorno/{bufeForgalomId}")
	public void vasarlasStorno(@PathVariable Integer bufeForgalomId, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr=getBufeUsr(httpRequest);
		service.vasarlasStorno( bufeUsr, bufeForgalomId );
	}
}