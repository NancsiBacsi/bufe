package hu.nancsibacsi.bufe.exception;

public class NotFoundException extends RuntimeException {
	private static final long serialVersionUID = 7834834283379832041L;
	public NotFoundException( String message ) {
		super( message );
	}
}
