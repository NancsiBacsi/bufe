package hu.nancsibacsi.bufe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.BufeUsrAddRequest;
import hu.nancsibacsi.bufe.dto.BufeUsrEgyenlegResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrFeltoltesRequest;
import hu.nancsibacsi.bufe.dto.EgyenlegResponse;
import hu.nancsibacsi.bufe.dto.BufeUsrSetActiveRequest;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.InvalidCredentialsException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/bufeusr")
public class BufeUsrController extends SessionController {
	public BufeUsrController(BufeUsrService bufeUsrService) {
		super( bufeUsrService );
	}

	@PostMapping("/egyenleg")
    public EgyenlegResponse getEgyenleg(HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr=getBufeUsr(httpRequest);
        return bufeUsrService.getEgyenleg(bufeUsr.id());
    }

    @PostMapping("/{bufeUsrId}")
    public BufeUsr get(@PathVariable Integer bufeUsrId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	return bufeUsrService.getById( bufeUsrId );
    }
    
    @PostMapping("/save")
	public BufeUsr save(@RequestBody BufeUsr act, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	if( act.id()<0 )
    		act.id( null );
		return bufeUsrService.save(act);
	}
    
    @PostMapping("/addtobufe")
	public ResponseEntity<Void> addToBufe(@RequestBody BufeUsrAddRequest req, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	bufeUsrService.add( req.bufeId(), req.usrId() );
    	return ResponseEntity.noContent().build();
	}
    
    @PostMapping("/setactive")
	public ResponseEntity<Void> setActive(@RequestBody BufeUsrSetActiveRequest req, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new InvalidCredentialsException( "Admin jogosultság szükséges!" );
    	bufeUsrService.setActive( req.bufeUsrId(), req.active() );
    	return ResponseEntity.noContent().build();
	}
    
	@PostMapping("/listegyenleg")
    public BufeUsrEgyenlegResponse getListEgyenleg(HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr=getBufeUsr(httpRequest);
    	if( !bufeUsr.penztaros() )
    		throw new InvalidCredentialsException( "Pénztáros jogosultság szükséges!" );
        return bufeUsrService.getListEgyenleg(bufeUsr.bufe().id());
    }
    @PostMapping("/addegyenleg")
	public ResponseEntity<Void> addEgyenleg(@RequestBody BufeUsrFeltoltesRequest req, HttpServletRequest httpRequest) {
    	BufeUsr bufeUsr=getBufeUsr(httpRequest);
    	if( !bufeUsr.penztaros() )
    		throw new InvalidCredentialsException( "Pénztáros jogosultság szükséges!" );
    	bufeUsrService.addEgyenleg( bufeUsr.bufe(), req.bufeUsrId(), req.feltoltes() );
    	return ResponseEntity.noContent().build();
	}
}
