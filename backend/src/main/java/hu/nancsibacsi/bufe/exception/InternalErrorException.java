package hu.nancsibacsi.bufe.exception;

public class InternalErrorException extends RuntimeException {
	private static final long serialVersionUID = 4081176376469005546L;

	public InternalErrorException(String message) {
		super(message);
	}
}
