package hu.nancsibacsi.bufe.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.ListBufeResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.dto.UsrBufeRelationResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.service.BufeService;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/bufe")
public class BufeController extends SessionController {
	private final BufeService service;
	private final BufeUsrService bufeUsrService;

	public BufeController(BufeService service, BufeUsrService bufeUsrService) {
		this.service = service;
		this.bufeUsrService = bufeUsrService;
	}

    @PostMapping("/all/{active}")
    public ListBufeResponse getListByActive(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Bufe> bufek=service.getListByActive( active==1 );
    	return new ListBufeResponse( bufek );
    }
    @PostMapping("/{bufeId}")
    public Bufe get(@PathVariable Integer id, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	return service.getById( id );
    }
    @PostMapping("/save")
	public Bufe save(@RequestBody Bufe act, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	if( act.id()<0 )
    		act.id( null );
		return service.save(act);
	}
    @PostMapping("/{bufeId}/usrs")
    public UsrBufeRelationResponse getListByBufe(@PathVariable Integer bufeId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	return bufeUsrService.getListByBufe(bufeId);
    }
}