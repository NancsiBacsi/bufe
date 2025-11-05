package hu.nancsibacsi.bufe.exception;

public class SessionExpiredException extends RuntimeException {
	private static final long serialVersionUID = 2148454525985721205L;

	public SessionExpiredException( String message ) {
		super( message );
	}
}
