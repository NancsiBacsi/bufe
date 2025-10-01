package hu.nancsibacsi.bufe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.ListBufeResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.dto.ListUsrResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.service.BufeService;
import hu.nancsibacsi.bufe.service.UsrService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/bufe")
public class BufeController extends SessionController {
	private final BufeService service;
	private final UsrService usrService;

	public BufeController(BufeService service, UsrService usrService) {
		this.service = service;
		this.usrService = usrService;
	}

    @PostMapping("/all/{active}")
    public ResponseEntity<ListBufeResponse> getActiveBufeLista(@PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Bufe> bufek=service.getBufek( active==1 );
    	ListBufeResponse ret=new ListBufeResponse( bufek );
        return ResponseEntity.ok(ret);
    }
    @PostMapping("/{bufeId}")
    public ResponseEntity<Bufe> getBufe(@PathVariable Integer bufeId, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	Bufe ret=service.getBufeById( bufeId );
        return ResponseEntity.ok(ret);
    }
    @PostMapping("/save")
	public Bufe saveBufe(@RequestBody Bufe bufe, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	if( bufe.id()<0 )
    		bufe.id( null );
		return service.saveBufe(bufe);
	}
    @PostMapping("/{bufeId}/usrs/{active}")
    public ResponseEntity<ListUsrResponse> getUsrOfBufe(@PathVariable Integer bufeId, @PathVariable Integer active, HttpServletRequest httpRequest) {
    	LoginResponse loginResponse=getLoginResponse(httpRequest);
    	if( !loginResponse.admin() )
    		throw new AuthenticationException( "Admin jogosultság szükséges!" );
    	List<Usr> usrs=usrService.getAllUsrOfBufe(bufeId, active==1);
    	ListUsrResponse ret=new ListUsrResponse( usrs );
        return ResponseEntity.ok(ret);
    }
}