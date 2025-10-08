package hu.nancsibacsi.bufe.controller;

import java.util.List;

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
import hu.nancsibacsi.bufe.service.BufeUsrService;
import hu.nancsibacsi.bufe.service.TermekService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/termek")
public class TermekController extends SessionController {
	private final TermekService termekService;

	public TermekController(BufeUsrService bufeUsrService, TermekService termekService ) {
		super( bufeUsrService );
		this.termekService = termekService;
	}

    @PostMapping("/bufeusrtermekek")
    public BufeUsrTermekListaResponse getTermekLista(HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr = getBufeUsr(httpRequest);
        return termekService.getListByBufeUsr(bufeUsr.id());
    }

    @PostMapping("/all/{active}")
    public ListTermekResponse getActiveTermekLista(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Termek> termekek=termekService.getListByActive( active==1 );
    	return new ListTermekResponse( termekek );
    }
    @PostMapping("/{termekId}")
    public Termek get(@PathVariable Integer id, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	return termekService.getById( id );
    }
    @PostMapping("/save")
	public Termek save(@RequestBody Termek act, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	if( act.id()<0 )
    		act.id( null );
		return termekService.save(act);
	}
}
