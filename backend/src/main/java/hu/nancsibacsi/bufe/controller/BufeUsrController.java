package hu.nancsibacsi.bufe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/bufeusr")
public class BufeUsrController extends SessionController {
	private final BufeUsrService service;

	public BufeUsrController(BufeUsrService service) {
		this.service = service;
	}

	@PostMapping("/egyenleg")
    public ResponseEntity<BufeUsrEgyenlegResponse> getEgyenleg(HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr=getBufeUsr(httpRequest);
        return ResponseEntity.ok(service.getEgyenleg(bufeUsr));
    }	
}
