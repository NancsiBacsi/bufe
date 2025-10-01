package hu.nancsibacsi.bufe.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Büfé
 */
@Entity
@Table(name = "bufe")
@Getter
@Setter
@Accessors(fluent = true)
public class Bufe {
	/** Azonosító */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bufe_id_seq")
	@SequenceGenerator(name = "bufe_id_seq", sequenceName = "bufe_id_seq", allocationSize = 1)
	@Column(name = "id", nullable = false)
	private Integer id;

	/** Büfé név */
	@Column(name = "nev", nullable = false, length = 100)
	private String nev;

	/** Aktív-e */
	@Column(name = "aktiv", nullable = false, length = 1, columnDefinition = "char(1) default '1'")
	@Convert(converter = CharToBooleanConverterDefaultTrue.class)
	private Boolean aktiv;
}
