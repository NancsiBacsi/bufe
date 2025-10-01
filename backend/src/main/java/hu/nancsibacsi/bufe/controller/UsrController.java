package hu.nancsibacsi.bufe.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.service.UsrService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/usr")
public class UsrController {
	private final UsrService service;

	public UsrController(UsrService service) {
		this.service = service;
	}

}
