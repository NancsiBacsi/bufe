package hu.nancsibacsi.bufe.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Felhasználó
 */
@Entity
@Table(name = "usr")
@Getter
@Setter
@Accessors(fluent = true)
public class Usr {
	/** Azonosító */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usr_id_seq")
	@SequenceGenerator(name = "usr_id_seq", sequenceName = "usr_id_seq", allocationSize = 1)
	@Column(name = "id", nullable = false)
	private Integer id;

	/** Felhasználói név */
	@Column(name = "nev", nullable = false, length = 100)
	private String nev;

	/** Teljes név */
	@Column(name = "teljes_nev", nullable = false, length = 100, columnDefinition = "varchar(100) default 'Unknown'")
	private String teljesNev;

	/** Jelszó */
	@Column(name = "jelszo", nullable = false, length = 100)
	private String jelszo;

	/** E-mail cím */
	@Column(name = "email", nullable = true, length = 255)
	private String email;

	/** Admin-e */
	@Column(name = "admin", nullable = false, length = 1)
	@Convert(converter = CharToBooleanConverterDefaultTrue.class)
	private Boolean admin;

	/** Aktív-e */
	@Column(name = "aktiv", nullable = false, length = 1, columnDefinition = "char(1) default '1'")
	@Convert(converter = CharToBooleanConverterDefaultTrue.class)
	private Boolean aktiv;

	@OneToMany(mappedBy = "usr")
	private List<BufeUsr> bufeUsrs;	
}
