package hu.nancsibacsi.bufe.exception;

public class AuthenticationException extends RuntimeException {
	private static final long serialVersionUID = -7952223158867610131L;

	public AuthenticationException(String message) {
		super(message);
	}
}
