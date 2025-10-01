package hu.nancsibacsi.bufe.dto;

import java.util.List;

import hu.nancsibacsi.bufe.model.Usr;

public record ListUsrResponse(
	List<Usr> usrs) {
}
