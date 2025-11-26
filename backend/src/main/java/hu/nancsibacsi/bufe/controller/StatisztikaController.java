package hu.nancsibacsi.bufe.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.ForgalmiStatisztikaResponse;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeForgalomService;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/statisztika")
public class StatisztikaController extends SessionController {
	private final BufeForgalomService bufeForgalomService;
	
	public StatisztikaController(BufeUsrService bufeUsrService, BufeForgalomService bufeForgalomService) {
		super(bufeUsrService);
		this.bufeForgalomService = bufeForgalomService;
	}
	
	@PostMapping("/forgalom/{vege}")
	public ForgalmiStatisztikaResponse getLogByBufeUsrId(@PathVariable String vege, HttpServletRequest httpRequest) {
		BufeUsr bufeUsr = getBufeUsr(httpRequest);
		return bufeForgalomService.getForgalmiStatisztika(bufeUsr.bufe().id(), vege);
	}
}
