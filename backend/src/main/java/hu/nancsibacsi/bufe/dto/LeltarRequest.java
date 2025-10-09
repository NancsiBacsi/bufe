package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record LeltarRequest(
	List<LeltarTermekMennyiseg> termekek ) {
	public record LeltarTermekMennyiseg(
		Integer termekId,
		Integer talaltMennyiseg) {
	}
}
