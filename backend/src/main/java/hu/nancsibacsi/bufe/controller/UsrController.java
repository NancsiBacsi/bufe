package hu.nancsibacsi.bufe.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse;
import hu.nancsibacsi.bufe.dto.ListUsrResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import hu.nancsibacsi.bufe.service.LoginService;
import hu.nancsibacsi.bufe.service.UsrService;
import hu.nancsibacsi.bufe.util.Enc;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/usr")
public class UsrController extends SessionController {
	private final UsrService service;
	private final BufeUsrService bufeUsrService;

	public UsrController(UsrService service, BufeUsrService bufeUsrService) {
		this.service = service;
		this.bufeUsrService = bufeUsrService;
	}

    @PostMapping("/all/{active}")
    public ListUsrResponse getActiveUsrLista(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Usr> usrs=service.getListByActive( active==1 );
    	for( Usr usr:usrs )
    		usr.jelszo( Enc.decodeS( Enc.hexStringToByteArray( usr.jelszo() ), LoginService.SALT ) );
    	return new ListUsrResponse( usrs );
    }
    @PostMapping("/{id}")
    public Usr get(@PathVariable Integer id, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	Usr ret=service.getById( id );
    	ret.jelszo( Enc.decodeS( Enc.hexStringToByteArray( ret.jelszo() ), LoginService.SALT ) );
    	return ret;
    }
    @PostMapping("/save")
	public Usr save(@RequestBody Usr act, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	if( act.id()<0 )
    		act.id( null );
    	act.jelszo( Enc.hexDump( Enc.encodeS( act.jelszo(), LoginService.SALT ) ) );
		return service.save(act);
	}
    @PostMapping("/{usrId}/bufes")
    public BufeUsrRelationResponse getListByBufe(@PathVariable Integer usrId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	return bufeUsrService.getListByUsr(usrId);
    }
}
