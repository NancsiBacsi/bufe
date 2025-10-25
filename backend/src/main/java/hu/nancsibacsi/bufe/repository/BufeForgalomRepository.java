package hu.nancsibacsi.bufe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hu.nancsibacsi.bufe.model.BufeForgalom;

@Repository
public interface BufeForgalomRepository extends JpaRepository<BufeForgalom, Integer> {
	
	@Query(value = """
with param as (
  select b.id bufe_id, bu.id bufe_usr_id
  from bufe_usr bu
  inner join bufe b on bu.bufe_id=b.id and bu.id=:bufeUsrId and bu.aktiv='1'
), bu_egyenleg as (
  SELECT bu.plus_arres, bu.minus_arres, bu.hitel_keret, COALESCE(SUM(usr_valtozas), 0) egyenleg
  FROM bufe_usr bu
  inner join param p on bu.id=p.bufe_usr_id
  inner join bufe_forgalom bf on bu.id=bf.bufe_usr_id and bf.bufe_id=p.bufe_id
  group by bu.plus_arres, bu.minus_arres, bu.hitel_keret
), fifo_bevet as (
  select t.id termek_id, t.nev,
  sum( bf.mennyiseg ) OVER (PARTITION BY termek_id ORDER BY bf.at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)-bf.mennyiseg+1 blokk_eleje,
  sum( bf.mennyiseg ) OVER (PARTITION BY termek_id ORDER BY bf.at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) blokk_vege,
  row_number() OVER (PARTITION BY termek_id ORDER BY bf.at desc) rn,
  bf.ear
  from bufe_forgalom bf
  inner join param p on p.bufe_id=bf.bufe_id
  inner join termek t on bf.termek_id=t.id and t.aktiv='1'
  where bf.mennyiseg>0
  ORDER BY bf.at
), eddig_kiadott as (
  select t.id termek_id, -sum( bf.mennyiseg ) kiadott_mennyiseg
  from bufe_forgalom bf
  inner join param p on bf.bufe_id=p.bufe_id
  inner join termek t on bf.termek_id=t.id and t.aktiv='1'
  where bf.mennyiseg<0
  group by t.id
), termekarak as (
  select termek_id, nev, case when egyenleg_hitellel>=pear then pear else mear end ear, ear beszerzesi_ear
  from (
    select t.id termek_id, t.nev, fb.ear, bue.egyenleg+bue.hitel_keret egyenleg_hitellel,
	       ceil( fb.ear*(1+(bue.plus_arres/100.0)) ) pear, ceil( fb.ear*(1+(bue.minus_arres/100.0)) ) mear
    from termek t
    inner join bu_egyenleg bue on 1=1
    left outer join eddig_kiadott ek on t.id=ek.termek_id
    left outer join fifo_bevet fb on t.id=fb.termek_id and fb.blokk_eleje<=coalesce( ek.kiadott_mennyiseg, 0 )+1 and coalesce( ek.kiadott_mennyiseg, 0 )+1<=fb.blokk_vege
    where t.aktiv='1' and t.id>1 and fb.ear is not null
  )
)
select id, termek_id, nev, ear, next_ear, order_date from (
  select bf.id, bf.termek_id, t.nev, -bf.usr_valtozas ear, coalesce( ta.ear, 0 ) next_ear, to_char(bf.at, 'YYYY.MM.DD hh24:mi' ) order_date, row_number() OVER(PARTITION BY 1 ORDER BY bf.id desc) rn
  from bufe_forgalom bf
  inner join termek t on t.id=bf.termek_id and t.id>1 AND bf.usr_valtozas<0
  inner join param p on 1=1 AND bf.bufe_usr_id=p.bufe_usr_id
  left outer join termekarak ta on bf.termek_id=ta.termek_id 
)
where rn<=10
order by id desc""",
		nativeQuery = true
	)
	List<Object[]> getLogByBufeUsrId(@Param("bufeUsrId") Integer bufeUsrId);	
	
	@Query(value = """
select id, nev, ear from (
	select t.id, t.nev, coalesce( bf.ear, 0 ) ear, row_number() OVER (PARTITION BY t.id ORDER BY bf.id desc) rn
	from termek t
	left outer join bufe_forgalom bf on t.id=bf.termek_id and bf.muvelet=5 and bf.bufe_id=:bufeId
	where t.aktiv='1' and t.id>1
)
where rn=1
order by nev""",
		nativeQuery = true
	)
	List<Object[]> getListEar(@Param("bufeId") Integer bufeId);

	@Query(value = """
with mennyiseg as (
	select termek_id, sum(mennyiseg) mennyiseg
	from bufe_forgalom bf
	where bf.bufe_id=:bufeId
	group by termek_id
)
select e.*, m.mennyiseg from (
	select id, nev, ear from (
		select t.id, t.nev, coalesce( bf.ear, 0 ) ear, row_number() OVER (PARTITION BY t.id ORDER BY bf.id desc) rn
		from termek t
		left outer join bufe_forgalom bf on t.id=bf.termek_id and bf.muvelet=5 and bf.bufe_id=:bufeId
		where t.aktiv='1' and t.id>1
	)
	where rn=1
) e
inner join mennyiseg m on e.id=m.termek_id
order by case when m.mennyiseg>0 then 1 else 0 end desc, e.nev""",
		nativeQuery = true
	)
	List<Object[]> getListMennyiseg(@Param("bufeId") Integer bufeId);
	
	@Query(value = """
with talalt_mennyiseg as (
	select *
	from jsonb_to_recordset(cast(:talaltMennyisegek as jsonb))
	as x(termek_id int, mennyiseg int)
), last_beszerzesi_ar as (
	select id termek_id, nev, ear from (
		select t.id, t.nev, coalesce( bf.ear, 0 ) ear, row_number() OVER (PARTITION BY t.id ORDER BY bf.id desc) rn
		from termek t
		left outer join bufe_forgalom bf on t.id=bf.termek_id and bf.muvelet=5 and bf.bufe_id=:bufeId
		where t.aktiv='1' and t.id>1
	)
	where rn=1
), sum_bevet as (
	select bf.termek_id, sum( bf.mennyiseg ) mennyiseg
	from bufe_forgalom bf
	where bf.mennyiseg>0 and bf.bufe_id=:bufeId
	group by bf.termek_id
),fifo_bevet as (
	select t.id termek_id, t.nev, bf.ear,
	       sum( bf.mennyiseg ) OVER (PARTITION BY termek_id ORDER BY bf.at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)-bf.mennyiseg+1 blokk_eleje,
	       sum( bf.mennyiseg ) OVER (PARTITION BY termek_id ORDER BY bf.at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) blokk_vege,
	       row_number() OVER (PARTITION BY termek_id ORDER BY bf.at desc) rn
	from bufe_forgalom bf
	inner join termek t on bf.bufe_id=:bufeId and bf.termek_id=t.id and t.aktiv='1'
	where bf.mennyiseg>0
	ORDER BY bf.at
), eddig_kiadott as (
	select t.id termek_id, -sum( bf.mennyiseg ) mennyiseg
	from bufe_forgalom bf
	inner join termek t on bf.bufe_id=:bufeId and bf.termek_id=t.id and t.aktiv='1'
	where bf.mennyiseg<0
	group by t.id
)
select s1.termek_id, 
       case when s1.elso_hiany is not null
	   		then -(fb.blokk_vege-greatest( s1.elso_hiany, fb.blokk_eleje )+1)
	   		else s1.tobblet end mennyiseg,
	   case when s1.elso_hiany is not null then fb.ear else lba.ear end ear
from (
	select tm.termek_id, tm.mennyiseg talalt, sb.mennyiseg bevet, ek.mennyiseg kiadott,
	       case when sb.mennyiseg>ek.mennyiseg+tm.mennyiseg then ek.mennyiseg+tm.mennyiseg+1 else null end elso_hiany,
		   case when sb.mennyiseg<ek.mennyiseg+tm.mennyiseg then ek.mennyiseg+tm.mennyiseg-sb.mennyiseg else null end tobblet
	from talalt_mennyiseg tm
	inner join sum_bevet sb on tm.termek_id=sb.termek_id
	left outer join eddig_kiadott ek on tm.termek_id=ek.termek_id
) s1
inner join last_beszerzesi_ar lba on s1.termek_id=lba.termek_id
left outer join fifo_bevet fb on s1.termek_id=fb.termek_id and blokk_vege>=s1.elso_hiany
order by fb.termek_id, fb.blokk_eleje""",
		nativeQuery = true)
	List<Object[]> getLeltarTobbletHiany(@Param("bufeId") Integer bufeId, @Param("talaltMennyisegek") String talaltMennyisegek);

	@Query(value = """
WITH keszlet AS (
  SELECT t.id termek_id, t.nev, sum( bf.mennyiseg ) db
  FROM termek t
  INNER JOIN bufe_forgalom bf ON bf.bufe_id=:bufeId AND t.id=bf.termek_id AND t.aktiv='1' AND t.id>1
  GROUP BY t.id, t.nev
), fogyas AS (
  SELECT bf.termek_id, k.nev, k.db keszlet, -sum( mennyiseg) fogyas,
         max( date_part('day', now()-bf.at ) )-min( date_part('day', now()-bf.at ) )+1 napok
  FROM bufe_forgalom bf
  INNER JOIN keszlet k ON bf.bufe_id=:bufeId AND bf.termek_id=k.termek_id
  WHERE bf.mennyiseg<0 AND date_part('day', now()-bf.at )<=:multNapok
  GROUP BY bf.termek_id, k.nev, k.db
), predict AS (
  SELECT f.*, ceil( cast( f.fogyas*:jovoNapok as double precision )/f.napok ) josolt_db
  FROM fogyas f
)
SELECT p.termek_id, p.nev, p.josolt_db-p.keszlet beszerzendo
FROM predict p
WHERE p.josolt_db-p.keszlet>0""",
		nativeQuery = true)
	List<Object[]> getBevasarloLista(@Param("bufeId") Integer bufeId, @Param("multNapok") Integer multNapok, @Param("jovoNapok") Integer jovoNapok);
}