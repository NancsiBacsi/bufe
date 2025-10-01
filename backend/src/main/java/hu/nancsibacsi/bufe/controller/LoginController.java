package hu.nancsibacsi.bufe.controller;

import java.util.concurrent.TimeUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.nancsibacsi.bufe.dto.ChangePasswordRequest;
import hu.nancsibacsi.bufe.dto.LoginRequest;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse.BufeInfo;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class LoginController extends SessionController {
	private final LoginService loginService;

	public LoginController(LoginService loginService) {
		this.loginService = loginService;
	}
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
		LoginResponse loginResponse=loginService.login(request);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(KEY_LOGIN_RESPONSE, loginResponse);
        if( loginResponse.bufeInfos().size()==1 ) {
        	BufeInfo bi=loginResponse.bufeInfos().get( 0 );
        	BufeUsr bufeUsr=loginService.selectBufe(loginResponse, bi.bufeId());
        	session.setAttribute(KEY_BUFE_USR, bufeUsr);
        }
        session.setMaxInactiveInterval((int) TimeUnit.MINUTES.toSeconds(30));
        return ResponseEntity.ok(loginResponse);
	}
	@PostMapping("/selectbufe/{bufeId}")
	public ResponseEntity<Void> selectBufe(@PathVariable Integer bufeId, HttpServletRequest httpRequest) {
		LoginResponse loginResponse = getLoginResponse(httpRequest);
		BufeUsr bufeUsr=loginService.selectBufe(loginResponse, bufeId);
		HttpSession session = httpRequest.getSession(false);
		if (session == null)
            throw new AuthenticationException( "Kérem jelentkezzen be újra!" );
		session.setAttribute(KEY_BUFE_USR, bufeUsr);
        return ResponseEntity.noContent().build();
	}
	@PostMapping("/changepassword")
	public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request, HttpServletRequest httpRequest) {
		LoginResponse loginResponse = getLoginResponse(httpRequest);
		loginService.changePassword(loginResponse, request);
        return ResponseEntity.noContent().build();
	}

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null)
            session.invalidate();
        return ResponseEntity.noContent().build();
    }	
}