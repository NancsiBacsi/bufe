package hu.nancsibacsi.bufe.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Terméktörzs. A pénz is egy speciális termék - id=1.
 */
@Entity
@Table(name = "termek")
@Getter
@Setter
@Accessors(fluent = true)
public class Termek {
	/** Azonosító */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "termek_id_seq")
	@SequenceGenerator(name = "termek_id_seq", sequenceName = "termek_id_seq", allocationSize = 1)
	@Column(name = "id", nullable = false)
	private Integer id;

	/** Termék név */
	@Column(name = "nev", nullable = false, length = 100)
	private String nev;

	/** Vonalkód */
	@Column(name = "vonal_kod", nullable = false, length = 100)
	private String vonalKod;

	/** Aktív-e */
	@Column(name = "aktiv", nullable = false, length = 1, columnDefinition = "char(1) default '1'")
	@Convert(converter = CharToBooleanConverterDefaultTrue.class)
	private Boolean aktiv;
}
