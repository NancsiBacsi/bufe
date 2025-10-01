package hu.nancsibacsi.bufe.exception;

public class OutOfStockException extends RuntimeException {
	private static final long serialVersionUID = 8874712615335613580L;

	public OutOfStockException( String message ) {
		super( message );
	}
}
