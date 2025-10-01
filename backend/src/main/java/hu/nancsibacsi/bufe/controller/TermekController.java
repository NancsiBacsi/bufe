package hu.nancsibacsi.bufe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BufeUsrTermekListaResponse;
import hu.nancsibacsi.bufe.dto.ListTermekResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.Termek;
import hu.nancsibacsi.bufe.service.TermekService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/termek")
public class TermekController extends SessionController {
	private final TermekService service;

	public TermekController(TermekService service ) {
		this.service = service;
	}

    @PostMapping("/bufeusrtermekek")
    public ResponseEntity<BufeUsrTermekListaResponse> getTermekLista(HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr = getBufeUsr(httpRequest);
        return ResponseEntity.ok(service.getTermekLista(bufeUsr.id()));
    }

    @PostMapping("/all/{active}")
    public ResponseEntity<ListTermekResponse> getActiveTermekLista(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Termek> termekek=service.getTermekek( active==1 );
    	ListTermekResponse ret=new ListTermekResponse( termekek );
        return ResponseEntity.ok(ret);
    }
    @PostMapping("/{termekId}")
    public ResponseEntity<Termek> getTermek(@PathVariable Integer termekId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	Termek ret=service.getTermekById( termekId );
        return ResponseEntity.ok(ret);
    }
    @PostMapping("/save")
	public Termek saveTermek(@RequestBody Termek termek, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	if( termek.id()<0 )
    		termek.id( null );
		return service.saveTermek(termek);
	}
}
