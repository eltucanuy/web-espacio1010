/**
 * Guardado del lead de pre-registro vía la RPC pública `crear_lead_landing`
 * (PostgREST, proyecto Supabase compartido con la PWA). Reemplaza al INSERT
 * directo en `pre_registros` (2026-07-19).
 *
 * Fail-soft y fire-and-forget: la UI muestra el éxito ANTES e independiente
 * de este guardado; cualquier falla solo loguea un console.warn.
 */
export function guardarLead(lead: {
  nombre: string;
  apellido: string;
  telefono: string;
  origen: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}): void {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  fetch(`${url}/rest/v1/rpc/crear_lead_landing`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      p_nombre: lead.nombre,
      p_apellido: lead.apellido,
      p_telefono: lead.telefono,
      p_origen: lead.origen,
      p_utm_source: lead.utm_source,
      p_utm_medium: lead.utm_medium,
      p_utm_campaign: lead.utm_campaign,
    }),
  }).then(
    () => {},
    (err: unknown) => console.warn('lead rpc failed', err)
  );
}
