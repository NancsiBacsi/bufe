package hu.nancsibacsi.bufe.util;

public class Conv {
	public static Integer toInt(Object obj) {
	    return obj != null ? ((Number)obj).intValue() : null;
	}
}
