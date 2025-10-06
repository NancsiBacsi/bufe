package hu.nancsibacsi.bufe.config;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;

@Configuration
public class JacksonConfig {

	@Bean
	public Jackson2ObjectMapperBuilderCustomizer customizeObjectMapper() {
		return builder -> {
			// Fluent gettereket is észlelje
			builder.visibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
			builder.visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
			builder.visibility(PropertyAccessor.GETTER, JsonAutoDetect.Visibility.PUBLIC_ONLY);
			builder.visibility(PropertyAccessor.IS_GETTER, JsonAutoDetect.Visibility.PUBLIC_ONLY);
			// Hibernate modul (lazy proxy kezelés)
			builder.modules(new Hibernate6Module().enable(Hibernate6Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS));
		};
	}
}