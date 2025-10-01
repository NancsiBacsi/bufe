package hu.nancsibacsi.bufe.dto;

public record ChangePasswordRequest(
	String elozoJelszo,
	String ujJelszo,
	String ujJelszo2) {
}