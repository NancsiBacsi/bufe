package hu.nancsibacsi.bufe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.nancsibacsi.bufe.model.Bufe;

@Repository
public interface BufeRepository extends JpaRepository<Bufe, Integer> {
	List<Bufe> findByAktivTrueOrderByNevAsc();
	List<Bufe> findByAktivFalseOrderByNevAsc();
}