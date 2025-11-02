package hu.nancsibacsi.bufe;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.nancsibacsi.bufe.dto.LoginRequest;
import hu.nancsibacsi.bufe.dto.LoginResponse;
import hu.nancsibacsi.bufe.exception.AuthenticationException;
import hu.nancsibacsi.bufe.repository.BufeUsrRepository;
import hu.nancsibacsi.bufe.repository.UsrRepository;
import hu.nancsibacsi.bufe.service.LoginService;
import hu.nancsibacsi.bufe.util.Enc;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {
	@Mock
	UsrRepository usrRepository;
	@Mock
	BufeUsrRepository bufeUsrRepository;
	@InjectMocks
	LoginService loginService;

	@Test
	void login_user_jo_jelszo() {
		when(usrRepository.findByNevAndJelszo(TestData.TESZTUSER_NEV, TestData.TESZTUSER_ENC_JELSZO))
			.thenReturn(Optional.of(TestData.TESZTUSER()));
		when(bufeUsrRepository.findByUsrIdWithBufe(TestData.TESZTUSER_ID))
			.thenReturn(List.of(TestData.TESZTBUFE_TESZTUSER()));

		LoginResponse resp = loginService.login(new LoginRequest(TestData.TESZTUSER_NEV, TestData.TESZTUSER_JELSZO));

		assertEquals(TestData.TESZTUSER_ID, resp.usrId());
		assertEquals(TestData.TESZTUSER_NEV, resp.nev());
		assertEquals(false, resp.admin());
		assertEquals(1, resp.bufeInfos().size());
		assertEquals(TestData.TESZTBUFE_ID, resp.bufeInfos().get(0).bufeId());
		assertEquals(false, resp.bufeInfos().get(0).penztaros());
		
		verify(usrRepository).findByNevAndJelszo(TestData.TESZTUSER_NEV, TestData.TESZTUSER_ENC_JELSZO);
		verify(bufeUsrRepository).findByUsrIdWithBufe(TestData.TESZTUSER_ID);
	}

	@Test
    void login_user_elgepelt_jelszo() {
	    when(usrRepository.findByNevAndJelszo(eq(TestData.TESZTUSER_NEV), any()))
	    	.thenReturn(Optional.empty());

        String hibasJelszo = Enc.hexDump(Enc.encodeS("hibas", LoginService.SALT));
        assertThrows(AuthenticationException.class,
        	() -> loginService.login(new LoginRequest(TestData.TESZTUSER_NEV, hibasJelszo))
        );
        
        verify(usrRepository).findByNevAndJelszo(eq(TestData.TESZTUSER_NEV), any());
    }

	@Test
	void login_admin_jo_jelszo() {
		when(usrRepository.findByNevAndJelszo(TestData.TESZTADMIN_NEV, TestData.TESZTADMIN_ENC_JELSZO))
			.thenReturn(Optional.of(TestData.TESZTADMIN()));
		when(bufeUsrRepository.findByUsrIdWithBufe(TestData.TESZTADMIN_ID))
			.thenReturn(List.of(TestData.TESZTBUFE_TESZTADMIN()));

		LoginResponse resp = loginService.login(new LoginRequest(TestData.TESZTADMIN_NEV, TestData.TESZTADMIN_JELSZO));

		assertEquals(TestData.TESZTADMIN_ID, resp.usrId());
		assertEquals(TestData.TESZTADMIN_NEV, resp.nev());
		assertEquals(true, resp.admin());
		assertEquals(1, resp.bufeInfos().size());
		assertEquals(TestData.TESZTBUFE_ID, resp.bufeInfos().get(0).bufeId());
		assertEquals(true, resp.bufeInfos().get(0).penztaros());
		
		verify(usrRepository).findByNevAndJelszo(TestData.TESZTADMIN_NEV, TestData.TESZTADMIN_ENC_JELSZO);
		verify(bufeUsrRepository).findByUsrIdWithBufe(TestData.TESZTADMIN_ID);
	}

	@Test
    void login_admin_elgepelt_jelszo() {
	    when(usrRepository.findByNevAndJelszo(eq(TestData.TESZTADMIN_NEV), any()))
	    	.thenReturn(Optional.empty());

        String hibasJelszo = Enc.hexDump(Enc.encodeS("hibas", LoginService.SALT));
        assertThrows(AuthenticationException.class,
        	() -> loginService.login(new LoginRequest(TestData.TESZTADMIN_NEV, hibasJelszo))
        );
        
        verify(usrRepository).findByNevAndJelszo(eq(TestData.TESZTADMIN_NEV), any());
    }
}
