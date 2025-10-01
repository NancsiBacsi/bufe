package hu.nancsibacsi.bufe.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CharToBooleanConverterDefaultFalse implements AttributeConverter<Boolean, String> {
	@Override
	public String convertToDatabaseColumn(Boolean attribute) {
		if (attribute == null)
			return "0"; // db defaulttal azonos kell hogy legyen!
		return attribute ? "1" : "0";
	}

	@Override
	public Boolean convertToEntityAttribute(String dbData) {
		if (dbData == null)
			return null; // ha a db-ben null van, hát null van - erre nem vonatkozik a default.
		return dbData.equals("1");
	}
}