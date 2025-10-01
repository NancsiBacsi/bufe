package hu.nancsibacsi.bufe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Table(name = "bufe_usr")
@Getter
@Setter
@Accessors(fluent = true)
public class BufeUsr {
	/** Azonosító */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bufe_usr_id_seq")
	@SequenceGenerator(name = "bufe_usr_id_seq", sequenceName = "bufe_usr_id_seq", allocationSize = 1)
	@Column(name = "id", nullable = false)
	private Integer id;

	/** Büfé */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bufe_id", nullable = false)
	@JsonIgnore
	private Bufe bufe;

	/** Felhasználó */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usr_id", nullable = false)
	private Usr usr;

	/** Pénztáros-e */
	@Column(name = "penztaros", nullable = false, length = 1)
	@Convert(converter = CharToBooleanConverterDefaultFalse.class) // itt default NEM pénztáros
	private Boolean penztaros;

	/** Ennyire mehet mínuszba */
	@Column(name = "hitel_keret", nullable = false)
	private Integer hitelKeret;

	/** Árrés, ha pluszban van */
	@Column(name = "plus_arres", nullable = false)
	private Integer plusArres;

	/** Árrés, ha mínuszban van */
	@Column(name = "minus_arres", nullable = false)
	private Integer minusArres;

	/** Aktív-e */
	@Column(name = "aktiv", nullable = false, length = 1, columnDefinition = "char(1) default '1'")
	@Convert(converter = CharToBooleanConverterDefaultTrue.class)
	private Boolean aktiv;
}