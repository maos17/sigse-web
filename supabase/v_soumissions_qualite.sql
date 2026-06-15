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
  -- Vraies anomalies (à traiter) : base du tri et des badges de criticité.
  count(qf.id) filter (where qf.resolu = false and qf.gravite = 'anomalie')
    as anomalies_ouvertes,
  array_agg(distinct qf.type::text)
    filter (where qf.resolu = false and qf.gravite = 'anomalie')
    as types_anomalies,
  -- Signalements informatifs (non bloquants).
  count(qf.id) filter (where qf.resolu = false and qf.gravite = 'info')
    as infos_ouvertes,
  array_agg(distinct qf.type::text)
    filter (where qf.resolu = false and qf.gravite = 'info')
    as types_infos
from submissions s
  left join forms f          on f.id = s.form_id
  left join profiles p       on p.id = s.enqueteur_id
  left join quality_flags qf on qf.submission_id = s.id
group by s.id, f.titre, p.nom_complet, s.statut, s.donnees, s.duree_saisie_secondes, s.synced_at;

-- Les vues héritent des RLS des tables sous-jacentes (security_invoker).
-- Sur Postgres 15+ (Supabase) :
alter view v_soumissions_qualite set (security_invoker = true);
