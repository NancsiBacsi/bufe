package hu.nancsibacsi.bufe.exception;

public class ForbiddenException extends RuntimeException {
	private static final long serialVersionUID = 8827796236524172816L;

	public ForbiddenException( String message ) {
		super( message );
	}
}
