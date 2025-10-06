package hu.nancsibacsi.bufe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.nancsibacsi.bufe.model.Usr;

@Repository
public interface UsrRepository extends JpaRepository<Usr, Integer> {
	Optional<Usr> findByNevAndJelszo(String nev, String jelszo);
	List<Usr> findByAktivTrueOrderByNevAsc();
	List<Usr> findByAktivFalseOrderByNevAsc();
}
