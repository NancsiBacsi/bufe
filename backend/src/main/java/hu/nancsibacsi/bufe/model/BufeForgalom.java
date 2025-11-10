package hu.nancsibacsi.bufe.model;

import java.beans.Transient;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Büfé forgalma
 */
@Entity
@Table(name = "bufe_forgalom")
@Getter
@Setter
@Accessors(fluent = true)
public class BufeForgalom {
	/** Azonosító */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bufe_forgalom_id_seq")
	@SequenceGenerator(name = "bufe_forgalom_id_seq", sequenceName = "bufe_forgalom_id_seq", allocationSize = 20)
	@Column(name = "id", nullable = false)
	private Integer id;

	/** Büfé */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bufe_id", nullable = false)
	private Bufe bufe;

	/** Művelet (1-8), lásd MuveletTipus */
	@Column(name = "muvelet", nullable = false)
	private Integer muvelet;

	/** Érintett termék */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "termek_id", nullable = false)
	private Termek termek;

	/** Egységár */
	@Column(name = "ear", nullable = false)
	private Integer ear;

	/** Mennyiség */
	@Column(name = "mennyiseg", nullable = false)
	private Integer mennyiseg;

	/** Változás értéke */
	@Column(name = "valtozas", nullable = false)
	private Integer valtozas;

	/** Érintett felhasználó (opcionális) */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bufe_usr_id")
	private BufeUsr bufeUsr;

	/** Felhasználó változás (opcionális) */
	@Column(name = "usr_valtozas")
	private Integer usrValtozas;

	/** Időbélyeg */
	@Column(name = "at", nullable = false)
	private Date at;
	
	/** Időbélyeg, nap pontosságú */
	@Column(name = "at_date", insertable = false, updatable = false)
	private Date atDate;
	
    @Transient
    public MuveletTipus muveletTipus() {
        return MuveletTipus.fromCode(muvelet);
    }	
}