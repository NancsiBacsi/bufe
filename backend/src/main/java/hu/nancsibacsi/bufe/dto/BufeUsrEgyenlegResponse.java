package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record BufeUsrEgyenlegResponse(
	List<BufeUsrEgyenleg> bufeUsrs ) {
	public record BufeUsrEgyenleg(
		Integer bufeUsrid,
		String nev,
		Integer egyenleg,
		Integer feltoltes) {
	}
}
