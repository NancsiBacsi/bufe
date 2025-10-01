package hu.nancsibacsi.bufe.dto;

import hu.nancsibacsi.bufe.model.Termek;

public record TermekRequest(
	Integer usrId,
	Termek termek) {
}
