-- ============================================================
-- Vue consommée par l'app web (Section 1 : File de validation).
-- À exécuter dans : Supabase > SQL Editor > New query.
-- ============================================================
create or replace view v_soumissions_qualite as
select
  s.id,
  f.titre                       as formulaire,
  p.nom_complet                 as enqueteur,
  s.statut,
  (s.donnees ->> 'nom_chef_menage') as nom_chef_menage,
  s.duree_saisie_secondes,
  s.synced_at,
  count(qf.id) filter (where qf.resolu = false) as anomalies_ouvertes,
  string_agg(distinct qf.type::text, ', ')
    filter (where qf.resolu = false)            as types_anomalies
from submissions s
  left join forms f          on f.id = s.form_id
  left join profiles p       on p.id = s.enqueteur_id
  left join quality_flags qf on qf.submission_id = s.id
group by s.id, f.titre, p.nom_complet, s.statut, s.donnees, s.duree_saisie_secondes, s.synced_at;

-- Les vues héritent des RLS des tables sous-jacentes (security_invoker).
-- Sur Postgres 15+ (Supabase) :
alter view v_soumissions_qualite set (security_invoker = true);
