package hu.nancsibacsi.bufe.controller;

import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.service.BufeUsrService;
import hu.nancsibacsi.bufe.service.UsrService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class SessionController {
	protected static final String KEY_LOGIN_RESPONSE="loginResponse";
	protected static final String KEY_BUFE_USR="bufeUsr";
    
	protected BufeUsrService bufeUsrService;
	
	public SessionController( BufeUsrService bufeUsrService ) {
		this.bufeUsrService = bufeUsrService;
	}
	protected LoginResponse getLoginResponse(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null)
            throw new AuthenticationException( "Kérem jelentkezzen be újra!" );
        LoginResponse loginResponse = (LoginResponse) session.getAttribute(KEY_LOGIN_RESPONSE);
        if (loginResponse == null)
            throw new AuthenticationException( "Kérem jelentkezzen be újra!" );
        return loginResponse;
    }
	protected BufeUsr getBufeUsr(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null)
            throw new AuthenticationException( "Kérem jelentkezzen be újra!" );
        BufeUsr bufeUsr = (BufeUsr) session.getAttribute(KEY_BUFE_USR);
        if (bufeUsr == null)
            throw new AuthenticationException( "Kérem jelentkezzen be újra!" );
        return bufeUsrService.getById( bufeUsr.id() );
    }
	protected boolean isDemoAdmin( LoginResponse loginResponse ) {
		return loginResponse.usrId().intValue()==UsrService.DEMO_ADMIN;
	}
}
