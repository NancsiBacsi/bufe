package hu.nancsibacsi.bufe.exception;

public class InvalidCredentialsException extends RuntimeException {
	private static final long serialVersionUID = 596093370264954153L;

	public InvalidCredentialsException(String message) {
		super(message);
	}
}
