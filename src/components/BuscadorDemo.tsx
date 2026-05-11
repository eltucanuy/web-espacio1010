import { useMemo, useState } from 'react';

/**
 * Mini-buscador demo embebido en landing.
 *
 * Esto NO es el buscador real (vive en agenda.espacio1010.uy con datos reales).
 * Es un mockup visual con slots fake plausibles para que el visitante VEA
 * cómo funciona el flujo sin tener que registrarse. Cualquier click en
 * "Reservar" lo manda a la PWA real.
 *
 * Cuando exista endpoint público read-only en la PWA, este componente se
 * puede swap-ear por uno conectado a Supabase. Mantengo la misma forma de
 * datos para que la migración sea drop-in.
 */

interface SlotMock {
  espacio: string;
  espacioId: string;
  capacidad: string;
  diaLabel: string;
  hora: string;
  estado: 'libre' | 'pocos' | 'ultimo';
}

interface Props {
  agendaUrl: string;
}

// Genera "días" relativos al hoy del cliente — siempre "próximos 5 días".
function buildMockSlots(): { tabs: { label: string; key: string }[]; slots: Record<string, SlotMock[]> } {
  const dias = ['Hoy', 'Mañana', 'Sábado', 'Domingo', 'Lunes'];
  const tabs = dias.map((d) => ({ label: d, key: d.toLowerCase() }));

  // Variedad de tipos de slot para que se sienta real.
  const slots: Record<string, SlotMock[]> = {
    hoy: [
      { espacio: 'Estudio Norte', espacioId: 'estudio-norte', capacidad: '2-3 pers', diaLabel: 'Hoy', hora: '18 a 19 hs', estado: 'libre' },
      { espacio: 'Consulta III', espacioId: 'consulta-3', capacidad: '2 pers', diaLabel: 'Hoy', hora: '19 a 20 hs', estado: 'pocos' },
      { espacio: 'Salón Cobre', espacioId: 'salon-cobre', capacidad: '6-10 pers', diaLabel: 'Hoy', hora: '20 a 22 hs', estado: 'ultimo' },
    ],
    mañana: [
      { espacio: 'Estudio Sur', espacioId: 'estudio-sur', capacidad: '2-3 pers', diaLabel: 'Mañana', hora: '9 a 10 hs', estado: 'libre' },
      { espacio: 'Consulta I', espacioId: 'consulta-1', capacidad: '2 pers', diaLabel: 'Mañana', hora: '11 a 12 hs', estado: 'libre' },
      { espacio: 'Consulta VII', espacioId: 'consulta-7', capacidad: '2 pers', diaLabel: 'Mañana', hora: '15 a 16 hs', estado: 'pocos' },
      { espacio: 'Estudio Norte', espacioId: 'estudio-norte', capacidad: '2-3 pers', diaLabel: 'Mañana', hora: '17 a 18 hs', estado: 'libre' },
    ],
    sábado: [
      { espacio: 'Sala Subsuelo', espacioId: 'sala-subsuelo', capacidad: '20-30 pers', diaLabel: 'Sábado', hora: '10 a 13 hs', estado: 'ultimo' },
      { espacio: 'Salón Roble', espacioId: 'salon-roble', capacidad: '6-8 pers', diaLabel: 'Sábado', hora: '14 a 16 hs', estado: 'libre' },
      { espacio: 'Estudio Sur', espacioId: 'estudio-sur', capacidad: '2-3 pers', diaLabel: 'Sábado', hora: '16 a 17 hs', estado: 'libre' },
    ],
    domingo: [
      { espacio: 'Salón Cobre', espacioId: 'salon-cobre', capacidad: '6-10 pers', diaLabel: 'Domingo', hora: '10 a 12 hs', estado: 'libre' },
      { espacio: 'Consulta II', espacioId: 'consulta-2', capacidad: '2 pers', diaLabel: 'Domingo', hora: '15 a 16 hs', estado: 'pocos' },
    ],
    lunes: [
      { espacio: 'Consulta IV', espacioId: 'consulta-4', capacidad: '3 pers', diaLabel: 'Lunes', hora: '8 a 9 hs', estado: 'libre' },
      { espacio: 'Estudio Norte', espacioId: 'estudio-norte', capacidad: '2-3 pers', diaLabel: 'Lunes', hora: '10 a 11 hs', estado: 'libre' },
      { espacio: 'Consulta V', espacioId: 'consulta-5', capacidad: '2 pers', diaLabel: 'Lunes', hora: '14 a 15 hs', estado: 'pocos' },
      { espacio: 'Salón Roble', espacioId: 'salon-roble', capacidad: '6-8 pers', diaLabel: 'Lunes', hora: '17 a 20 hs', estado: 'libre' },
    ],
  };

  return { tabs, slots };
}

const ESTADO_LABEL: Record<SlotMock['estado'], { texto: string; color: string }> = {
  libre: { texto: 'Disponible', color: 'bg-emerald-100 text-emerald-800' },
  pocos: { texto: 'Pocos cupos', color: 'bg-amber-100 text-amber-800' },
  ultimo: { texto: 'Último', color: 'bg-terracota-tint text-terracota-dark' },
};

export default function BuscadorDemo({ agendaUrl }: Props) {
  const { tabs, slots } = useMemo(buildMockSlots, []);
  const [active, setActive] = useState(tabs[0].key);

  const activeSlots = slots[active] ?? [];

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-crema shadow-[var(--shadow-md)]">
      {/* Header del buscador */}
      <div className="flex flex-col gap-3 border-b border-hairline bg-crema-warm/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">
            Disponibilidad en tiempo real
          </p>
          <p className="mt-1 text-base text-ink-soft">
            Así ves la agenda cuando creás tu cuenta.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Demo · datos de ejemplo
        </span>
      </div>

      {/* Tabs días */}
      <div className="flex gap-1 overflow-x-auto border-b border-hairline px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-ink text-crema'
                  : 'text-ink-soft hover:bg-crema-warm/60 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Slots */}
      <div className="divide-y divide-hairline">
        {activeSlots.map((slot, i) => {
          const badge = ESTADO_LABEL[slot.estado];
          return (
            <div
              key={`${slot.espacioId}-${i}`}
              className="flex flex-col gap-4 px-6 py-5 transition-colors duration-300 hover:bg-crema-warm/30 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h4 className="font-display text-lg text-ink">{slot.espacio}</h4>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${badge.color}`}>
                    {badge.texto}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="text-ink">{slot.hora}</span>
                  <span className="mx-2">·</span>
                  {slot.capacidad}
                </p>
              </div>

              <a
                href={agendaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-terracota px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracota-dark hover:shadow-md sm:self-center"
              >
                Reservar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          );
        })}

        {activeSlots.length === 0 && (
          <div className="px-6 py-12 text-center text-ink-muted sm:px-8">
            No hay slots para este día en la demo. En la app real ves todos los horarios.
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-hairline bg-crema-warm/30 px-6 py-5 text-center sm:px-8">
        <p className="text-sm text-ink-soft">
          Esto es una demo con datos de ejemplo.{' '}
          <a
            href={agendaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-terracota underline-offset-4 hover:underline"
          >
            Crear cuenta gratis para ver la agenda real →
          </a>
        </p>
      </div>
    </div>
  );
}
