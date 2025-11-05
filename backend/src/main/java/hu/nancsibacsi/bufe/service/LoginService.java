package hu.nancsibacsi.bufe.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import hu.nancsibacsi.bufe.dto.ChangePasswordRequest;
import hu.nancsibacsi.bufe.dto.LoginRequest;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.dto.LoginResponse.BufeInfo;
import hu.nancsibacsi.bufe.exception.InvalidCredentialsException;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;
import hu.nancsibacsi.bufe.repository.UsrRepository;
import hu.nancsibacsi.bufe.util.Enc;

@Service
public class LoginService {
	public static final String SALT = "ct101";

	private final UsrRepository usrRepository;
	private final BufeUsrRepository bufeUsrRepository;

	public LoginService(UsrRepository usrRepository, BufeUsrRepository bufeUsrRepository) {
		this.usrRepository = usrRepository;
		this.bufeUsrRepository = bufeUsrRepository;	
	}

	public LoginResponse login(LoginRequest request) {
		String encodedPwd = Enc.hexDump(Enc.encodeS(request.jelszo(), SALT));
		System.out.println( "login: " + request.nev() + "/" + encodedPwd );
		Usr usr = usrRepository.findByNevAndJelszo(request.nev(), encodedPwd)
				.orElseThrow(() -> new InvalidCredentialsException("Hibás név vagy jelszó!"));
		List<BufeUsr> bufeUsrs = bufeUsrRepository.findByUsrIdWithBufe(usr.id());
		ArrayList<BufeInfo> bufeInfos = new ArrayList<>();
		for (BufeUsr bu : bufeUsrs)
			bufeInfos.add(new BufeInfo(bu.id(), bu.bufe().id(), bu.bufe().nev(), bu.penztaros()));
		return new LoginResponse(usr.id(), usr.nev(), usr.admin(), bufeInfos);
	}
	public BufeUsr selectBufe(LoginResponse loginResponse, Integer bufeId) {
		BufeUsr bufeUsr=bufeUsrRepository.findByBufeIdAndUsrId( bufeId, loginResponse.usrId() )
				.orElseThrow(() -> new InvalidCredentialsException( "Hibás büfé, jelentkezzen be újra!" ));
		return bufeUsr;
	}
	public void changePassword(LoginResponse loginResponse, ChangePasswordRequest request) {
		String encodedElozoJelszo = Enc.hexDump(Enc.encodeS(request.elozoJelszo(), SALT));
		Usr usr = usrRepository.findById( loginResponse.usrId() )
			.orElseThrow(() -> new InvalidCredentialsException("Ismeretlen felhasználó"));
		if( !usr.jelszo().equals( encodedElozoJelszo ) )
			throw new InvalidCredentialsException( "Helytelen előző jelszó" );
		if( request.ujJelszo().length()<6 )
			throw new InvalidCredentialsException( "A jelszó minimális hossza 6" );
		if( !request.ujJelszo().equals( request.ujJelszo2() ) )
			throw new InvalidCredentialsException( "A jelszó és ismétlése eltér" );
		String encodedUjJelszo = Enc.hexDump(Enc.encodeS(request.ujJelszo(), SALT));
		usr.jelszo( encodedUjJelszo );
		usrRepository.save( usr );
	}
}
