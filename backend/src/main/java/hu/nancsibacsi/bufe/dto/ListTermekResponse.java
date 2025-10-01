package hu.nancsibacsi.bufe.dto;

import java.util.List;

import hu.nancsibacsi.bufe.model.Termek;

public record ListTermekResponse(
	List<Termek> termekek) {
}
