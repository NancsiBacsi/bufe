package hu.nancsibacsi.bufe.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrRelationResponse.BufeUsrRelation;
import hu.nancsibacsi.bufe.dto.ListUsrResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.InvalidCredentialsException;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.service.BufeService;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import hu.nancsibacsi.bufe.service.LoginService;
import hu.nancsibacsi.bufe.service.UsrService;
import hu.nancsibacsi.bufe.util.Enc;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/usr")
public class UsrController extends SessionController {
	private final UsrService usrService;

	public UsrController(BufeUsrService bufeUsrService, UsrService usrService) {
		super( bufeUsrService );
		this.usrService = usrService;
	}

    @PostMapping("/all/{active}")
    public ListUsrResponse getActiveUsrLista(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	List<Usr> usrs=usrService.getListByActive( active==1, isDemoAdmin( loginResponse ) );
    	for( Usr usr:usrs )
    		usr.jelszo( Enc.decodeS( Enc.hexStringToByteArray( usr.jelszo() ), LoginService.SALT ) );
    	return new ListUsrResponse( usrs );
    }
    @PostMapping("/{usrId}")
    public Usr get(@PathVariable Integer usrId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	Usr ret=usrService.getById( usrId, isDemoAdmin( loginResponse ) );
    	ret.jelszo( Enc.decodeS( Enc.hexStringToByteArray( ret.jelszo() ), LoginService.SALT ) );
    	return ret;
    }
    @PostMapping("/save")
	public Usr save(@RequestBody Usr act, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	if( act.id()<0 )
    		act.id( null );
    	else if( isDemoAdmin( loginResponse ) ) {
    		BufeUsrRelationResponse bur=bufeUsrService.getListByUsr( act.id() );
    		if( bur.relations().stream().filter( r->r.bufeUsrId()!=null && r.bufeId()<BufeService.DEMO_BUFE ).count()>0 )
    			throw new InvalidCredentialsException( "Demó számára tiltott művelet!" );
    	}
    	act.jelszo( Enc.hexDump( Enc.encodeS( act.jelszo(), LoginService.SALT ) ) );
		return usrService.save(act);
	}
    @PostMapping("/{usrId}/bufes")
    public BufeUsrRelationResponse getBufeListByUsr(@PathVariable Integer usrId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	BufeUsrRelationResponse bur=bufeUsrService.getListByUsr(usrId);
    	if( isDemoAdmin( loginResponse ) ) {
    		List<BufeUsrRelation> filtered=bur.relations().stream().filter( r->r.bufeId()>=BufeService.DEMO_BUFE ).toList();
    		bur=new BufeUsrRelationResponse( filtered );
    	}
    	return bur;
    }
}
