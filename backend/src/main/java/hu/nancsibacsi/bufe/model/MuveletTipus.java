package hu.nancsibacsi.bufe.model;

import hu.nancsibacsi.bufe.exception.NotFoundException;

public enum MuveletTipus {
	TAGI_BETET(1, "+tagi betét", +1),
	TAGI_KIVET(2, "-tagi kivét", -1),
	VASARLOI_BEFIZETES(3, "+vásárlói befizetés", +1),
	VASARLAS(4, "-vásárlás", -1),
	ARUBESZERZES(5, "+árubeszerzés", +1),
	ARUBESZERZES_ARA(6, "+árubeszerzés ára", +1),
	LELTAR_TOBBLET(7, "+leltár többlet", +1),
	LELTAR_HIANY(8, "-leltár hiány", -1);

	private final int code;
	private final String leiras;
	private final int elojel;

	MuveletTipus(int code, String leiras, int elojel) {
		this.code = code;
		this.leiras = leiras;
		this.elojel = elojel;
	}

	public int getCode() {
		return code;
	}

	public String getLeiras() {
		return leiras;
	}

	public int getElojel() {
		return elojel;
	}

	public static MuveletTipus fromCode(int code) {
		for (MuveletTipus m : values())
			if (m.code == code)
				return m;
		throw new NotFoundException("Ismeretlen művelet kód: " + code);
	}
}
