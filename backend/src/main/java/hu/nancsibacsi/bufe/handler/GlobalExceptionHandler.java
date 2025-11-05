package hu.nancsibacsi.bufe.handler;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import hu.nancsibacsi.bufe.exception.ForbiddenException;
import hu.nancsibacsi.bufe.exception.InvalidCredentialsException;
import hu.nancsibacsi.bufe.exception.NotFoundException;
import hu.nancsibacsi.bufe.exception.OutOfStockException;
import hu.nancsibacsi.bufe.exception.SessionExpiredException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	public static final Map<String, String> CONSTRAINT_TO_ERROR = Map.ofEntries(
		Map.entry("bufe_uq1", "Már van ilyen nevű büfé!"),
		Map.entry("bufe_usr_uq1", "Ez a büfé-felhasználó összerendelés már létezik!"),
		Map.entry("termek_uq1", "Már van ilyen nevű termék!"),
		Map.entry("termek_uq2", "Ez a vonalkód már egy másik termékhez van hozzárendelve!"),
		Map.entry("usr_uq1", "Már van ilyen nevű felhasználó!"),
		Map.entry("usr_uq2", "Már van e-mail című felhasználó!")
	);
	
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", ex.getMessage());
    }

    @ExceptionHandler(SessionExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleSessionExpired(SessionExpiredException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "SESSION_EXPIRED", ex.getMessage());
    }
    
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleForidden(ForbiddenException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "FORBIDDEN", ex.getMessage());
    }
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(OutOfStockException.class)
    public ResponseEntity<Map<String, Object>> handleOutOfStock(OutOfStockException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "OUT_OF_STOCK", ex.getMessage());
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(DataIntegrityViolationException ex) {
    	if( ex.getCause() instanceof ConstraintViolationException ) {
    		ConstraintViolationException ec=(ConstraintViolationException)ex.getCause();
    		String constraintName=ec.getConstraintName();
    		if( CONSTRAINT_TO_ERROR.containsKey( constraintName ) )
    			return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "UNKNOWN_ERROR", CONSTRAINT_TO_ERROR.get( constraintName ) );
    	}
    	return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "UNKNOWN_ERROR", "Adatbázis integritás megsértés.");
    }
    
    /*@ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBadURL(NoResourceFoundException ex) {
    	return buildResponse(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", ex.getMessage());
    }*/   
    @ExceptionHandler(Exception.class) // fallback
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
    	return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "UNKNOWN_ERROR", ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}