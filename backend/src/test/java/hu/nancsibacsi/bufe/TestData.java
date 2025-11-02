package hu.nancsibacsi.bufe;

import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.module.SimpleModule;

import hu.nancsibacsi.bufe.model.Bufe;
import hu.nancsibacsi.bufe.model.BufeUsr;
import hu.nancsibacsi.bufe.model.Usr;
import hu.nancsibacsi.bufe.util.Boolean01Deserializer;

public class TestData {
	
	private static final SimpleModule BOOLEAN_MODULE = new SimpleModule()
			.addDeserializer(Boolean.class, new Boolean01Deserializer())
			.addDeserializer(boolean.class, new Boolean01Deserializer());
	private static final ObjectMapper MAPPER = new ObjectMapper()
			.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
			.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
			.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true)
			.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
			.registerModule(BOOLEAN_MODULE);
	// Usr
	public static final int TESZTADMIN_ID=20001;
	public static final String TESZTADMIN_NEV="tesztadmin";
	public static final String TESZTADMIN_ENC_JELSZO="E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70";
	public static final String TESZTADMIN_JELSZO="a";
	public static final String TESZTADMIN_JSON="""
		{"id":20001,"nev":"tesztadmin","teljes_nev":"Teszt Admin","jelszo":"E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70","email":"tesztadmin@tesztadmin.teszt","admin":"1","aktiv":"1"}""";
	public static Usr TESZTADMIN() {
		try {
			return MAPPER.readValue(TESZTADMIN_JSON, Usr.class);
		} catch( Exception e ) {
			throw new RuntimeException("Hibás JSON: TestData.TESZTADMIN_JSON", e);
		}
	}
	
	public static final int TESZTUSER_ID=20002;
	public static final String TESZTUSER_NEV="tesztuser";
	public static final String TESZTUSER_ENC_JELSZO="E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70";
	public static final String TESZTUSER_JELSZO="a";
	public static final String TESZTUSER_JSON="""
		{"id":20002,"nev":"tesztuser","teljes_nev":"Teszt User","jelszo":"E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70","email":"tesztuser@tesztuser.teszt","admin":"0","aktiv":"1"}""";
	public static Usr TESZTUSER() {
		try {
			return MAPPER.readValue(TESZTUSER_JSON, Usr.class);
		} catch( Exception e ) {
			throw new RuntimeException("Hibás JSON: TestData.TESZTUSER_JSON", e);
		}
	}

	// Bufe
	public static final int TESZTBUFE_ID=20001;
	public static final String TESZTBUFE_JSON="""
			{"id":20001,"nev":"Teszt büfé","aktiv":"1"}""";
	public static Bufe TESZTBUFE() {
		try {
			return MAPPER.readValue(TESZTBUFE_JSON, Bufe.class);
		} catch( Exception e ) {
			throw new RuntimeException("Hibás JSON: TestData.TESZTBUFE_JSON", e);
		}
	}
	
	// BufeUsr
	public static final int TESZTBUFE_TESZTADMIN_ID=20001;
	public static final String TESZTBUFE_TESZTADMIN_JSON="""
			{"id":20001,"penztaros":"1","hitel_keret":1000,"plus_arres":0,"minus_arres":10,"aktiv":"1"}""";
	public static BufeUsr TESZTBUFE_TESZTADMIN() {
		try {
			BufeUsr bu = MAPPER.readValue(TESZTBUFE_TESZTADMIN_JSON, BufeUsr.class);
			bu.usr(TESZTADMIN()).bufe(TESZTBUFE());
			return bu;
		} catch( Exception e ) {
			throw new RuntimeException("Hibás JSON: TestData.TESZTBUFE_TESZTADMIN_JSON", e);
		}
	}

	public static final int TESZTBUFE_TESZTUSER_ID=20002;
	public static final String TESZTBUFE_TESZTUSER_JSON="""
			{"id":20002,"penztaros":"0","hitel_keret":0,"plus_arres":10,"minus_arres":20,"aktiv":"1"}""";
	public static BufeUsr TESZTBUFE_TESZTUSER() {
		try {
			BufeUsr bu = MAPPER.readValue(TESZTBUFE_TESZTUSER_JSON, BufeUsr.class);
			bu.usr(TESZTUSER()).bufe(TESZTBUFE());
			return bu;
		} catch( Exception e ) {
			throw new RuntimeException("Hibás JSON: TestData.TESZTBUFE_TESZTUSER_JSON", e);
		}
	}
}
