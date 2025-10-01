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
	
	@Query( value = """
select u.id usr_id, u.nev usr_nev, bu.id bufe_usr_id, case when bu.aktiv = '1' then true else false end bu_aktiv
from usr u
left outer join bufe_usr bu on u.id=bu.usr_id and bu.bufe_id=:bufeId and bu.aktiv=:aktiv 
where u.aktiv='1'			
			""",
			nativeQuery = true )
	List<Usr> findAllWithBufe(@Param("bufeId") Integer bufeId, @Param("aktiv") boolean aktiv);
}
