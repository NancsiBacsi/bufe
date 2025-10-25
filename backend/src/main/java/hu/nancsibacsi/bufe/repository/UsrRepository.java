package hu.nancsibacsi.bufe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hu.nancsibacsi.bufe.model.Usr;

@Repository
public interface UsrRepository extends JpaRepository<Usr, Integer> {
	Optional<Usr> findByNevAndJelszo(String nev, String jelszo);
	List<Usr> findByAktivTrueOrderByNevAsc();
	List<Usr> findByAktivFalseOrderByNevAsc();
	
	@Query( value = """
select * from (
  select u.*
  from usr u
  inner join bufe_usr bu on bu.usr_id=u.id and bu.bufe_id=20001 and u.aktiv=:aktiv
  union
  select u.*
  from usr u
  left join bufe_usr bu on bu.usr_id=u.id
  where bu.id is null and u.aktiv=:aktiv and u.admin='0'
)
ORDER BY nev""",
		nativeQuery = true
	)
	List<Usr> findByAktivOrderByNevAscDemo(@Param("aktiv") String aktiv);
}
