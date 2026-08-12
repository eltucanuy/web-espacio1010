/**
 * Marcas de campaña (UTMs + click IDs) — persistencia por sesión y reenvío a la PWA.
 *
 * Problema que resuelve (auditoría 2026-08-12): las marcas llegaban en la URL de
 * aterrizaje pero se perdían al navegar entre páginas internas o al usar cualquier
 * link a agenda.espacio1010.uy que no fuera el form del cupón → 81 registros post-4/7
 * cayeron al bucket "orgánico" sin serlo. Regla: la PWA solo puede atribuir lo que
 * le llega en la URL (gtm-init.js captura first-touch allí).
 *
 * SIN PII: acá viven solo utm_* y click IDs — jamás nombre/teléfono/email.
 * sessionStorage a propósito (no localStorage): la marca vale para ESTA visita;
 * una sesión nueva sin campaña no debe heredar la campaña de hace semanas.
 */
export const MARK_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'fbclid', 'gad_source', 'gad_campaignid',
] as const;

const SS_KEY = 'e10_marcas';

/** Si la URL actual trae marcas, las guarda una sola vez (first-touch de la sesión). */
export function persistirMarcas(): void {
  try {
    const p = new URLSearchParams(location.search);
    if (!MARK_KEYS.some((k) => p.get(k))) return;
    if (sessionStorage.getItem(SS_KEY)) return;
    const marcas: Record<string, string> = {};
    for (const k of MARK_KEYS) {
      const v = p.get(k);
      if (v) marcas[k] = v;
    }
    sessionStorage.setItem(SS_KEY, JSON.stringify(marcas));
  } catch {
    /* storage bloqueado (modo incógnito estricto): fail-soft, se pierde la marca */
  }
}

/** Marcas vigentes: lo persistido en la sesión, pisado por lo que traiga la URL actual. */
export function obtenerMarcas(): Record<string, string> {
  const marcas: Record<string, string> = {};
  try {
    const ss = sessionStorage.getItem(SS_KEY);
    if (ss) {
      const parsed = JSON.parse(ss) as Record<string, string>;
      for (const k of MARK_KEYS) if (typeof parsed[k] === 'string') marcas[k] = parsed[k];
    }
  } catch { /* ídem */ }
  try {
    const p = new URLSearchParams(location.search);
    for (const k of MARK_KEYS) {
      const v = p.get(k);
      if (v) marcas[k] = v;
    }
  } catch { /* ídem */ }
  return marcas;
}
