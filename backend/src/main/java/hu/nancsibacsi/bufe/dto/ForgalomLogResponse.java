package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record ForgalomLogResponse(
	List<ForgalomLogItem> logItems) {
	public record ForgalomLogItem(
		Integer bufeForgalomId,
		Integer termekId,
		String nev,
		Integer ear,
		Integer nextEar,
		String orderDate) {
	}
}
