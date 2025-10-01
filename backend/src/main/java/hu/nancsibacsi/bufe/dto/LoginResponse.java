package hu.nancsibacsi.bufe.dto;

import java.io.Serializable;
import java.util.List;

public record LoginResponse(
	Integer usrId,
	String nev,
	Boolean admin,
	List<BufeInfo> bufeInfos) implements Serializable {
	public record BufeInfo(
		Integer bufeUsrId,
		Integer bufeId,
		String bufeNev,
		Boolean penztaros) implements Serializable {
	}
}
