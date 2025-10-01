package hu.nancsibacsi.bufe.dto;

import java.util.List;

import hu.nancsibacsi.bufe.model.Bufe;

public record ListBufeResponse(
	List<Bufe> bufek) {
}
