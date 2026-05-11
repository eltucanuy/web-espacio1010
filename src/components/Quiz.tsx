import { useState } from 'react';

/**
 * Quiz recomendador "Qué espacio te conviene".
 *
 * 3 preguntas → recomienda 1-2 espacios + CTA reservar.
 * Sin tracking ni envío, todo cliente-side. La idea es ayudar a quien no
 * sabe por dónde empezar a entender qué se ofrece, no recolectar leads.
 */

type ProfesionKey = 'psi' | 'salud' | 'bienestar' | 'grupo' | 'otro';
type Capacidad = '1-2' | '3-5' | '6-15' | '16+';
type Mobiliario = 'completo' | 'versatil' | 'indistinto';

interface Recomendacion {
  espacioId: string;
  nombre: string;
  por_que: string;
}

interface Props {
  agendaUrl: string;
}

// Lógica de matching — simple pero defendible.
function recomendar(prof: ProfesionKey, cap: Capacidad, mob: Mobiliario): Recomendacion[] {
  // Grupos grandes siempre van a sala subsuelo.
  if (cap === '16+') {
    return [
      {
        espacioId: 'sala-subsuelo',
        nombre: 'Sala Subsuelo',
        por_que: 'La única sala con capacidad para 20-30 personas, sin columnas, mobiliario versátil.',
      },
    ];
  }

  // Grupos medianos → salones.
  if (cap === '6-15') {
    if (prof === 'bienestar' || prof === 'grupo') {
      return [
        { espacioId: 'salon-cobre', nombre: 'Salón Cobre', por_que: 'Versátil con colchonetas, ideal para meditación, yoga y grupos de bienestar.' },
        { espacioId: 'salon-roble', nombre: 'Salón Roble', por_que: 'Mobiliario versátil para 6-8 personas, perfecto para talleres o constelaciones.' },
      ];
    }
    return [
      { espacioId: 'salon-roble', nombre: 'Salón Roble', por_que: 'Versátil para talleres profesionales hasta 8 personas.' },
      { espacioId: 'salon-cobre', nombre: 'Salón Cobre', por_que: 'Más amplio (hasta 10 personas), para grupos terapéuticos o formaciones.' },
    ];
  }

  // Grupos chicos (3-5) → consultas amplias o estudios.
  if (cap === '3-5') {
    if (prof === 'psi') {
      return [
        { espacioId: 'consulta-4', nombre: 'Consulta IV', por_que: 'Amplia y mixta, ideal para psicología infantil, familias o sesiones con materiales.' },
        { espacioId: 'estudio-norte', nombre: 'Estudio Norte', por_que: 'Estudio premium con luz natural, suma calidez a sesiones de pareja o familia.' },
      ];
    }
    return [
      { espacioId: 'estudio-norte', nombre: 'Estudio Norte', por_que: 'El espacio más amplio entre los amueblados, hasta 3 personas cómodas.' },
      { espacioId: 'consulta-4', nombre: 'Consulta IV', por_que: 'Versátil para sesiones con materiales o tres personas.' },
    ];
  }

  // Sesiones individuales o de pareja (1-2 personas).
  if (mob === 'versatil') {
    return [
      { espacioId: 'estudio-sur', nombre: 'Estudio Sur', por_que: 'Mixto y cálido, te permite armar la sesión como necesites.' },
      { espacioId: 'consulta-5', nombre: 'Consulta V', por_que: 'Divan opcional, escritorio plegable. Versatilidad sin perder calidez.' },
    ];
  }

  if (prof === 'salud') {
    return [
      { espacioId: 'consulta-1', nombre: 'Consulta I', por_que: 'Sobria y profesional, perfecta para consulta clínica.' },
      { espacioId: 'consulta-7', nombre: 'Consulta VII', por_que: 'Luminosa con detalles de madera, suma formalidad y calidez.' },
    ];
  }

  if (prof === 'psi') {
    return [
      { espacioId: 'estudio-norte', nombre: 'Estudio Norte', por_que: 'Luz de mañana, sillón de terapia, escritorio macizo. El más elegido.' },
      { espacioId: 'consulta-2', nombre: 'Consulta II', por_que: 'Compacta y silenciosa, con foco en privacidad acústica.' },
    ];
  }

  return [
    { espacioId: 'consulta-3', nombre: 'Consulta III', por_que: 'Diseño contemporáneo, vista interior, escritorio plegable.' },
    { espacioId: 'consulta-6', nombre: 'Consulta VI', por_que: 'Pequeña y recogida, perfecta para sesiones cortas.' },
  ];
}

const preguntas = [
  {
    key: 'prof' as const,
    titulo: '¿A qué te dedicás?',
    opciones: [
      { value: 'psi' as ProfesionKey, label: 'Psicología / Psicoanálisis' },
      { value: 'salud' as ProfesionKey, label: 'Psiquiatría / Nutrición / Médica' },
      { value: 'bienestar' as ProfesionKey, label: 'Meditación / Yoga / Coaching' },
      { value: 'grupo' as ProfesionKey, label: 'Talleres / Constelaciones / Grupos' },
      { value: 'otro' as ProfesionKey, label: 'Otra disciplina' },
    ],
  },
  {
    key: 'cap' as const,
    titulo: '¿Para cuántas personas?',
    opciones: [
      { value: '1-2' as Capacidad, label: 'Sesión individual o pareja (1-2)' },
      { value: '3-5' as Capacidad, label: 'Sesión familiar o chica (3-5)' },
      { value: '6-15' as Capacidad, label: 'Grupo o taller mediano (6-15)' },
      { value: '16+' as Capacidad, label: 'Grupo grande o evento (16+)' },
    ],
  },
  {
    key: 'mob' as const,
    titulo: '¿Cómo te gusta el espacio?',
    opciones: [
      { value: 'completo' as Mobiliario, label: 'Amueblado clásico (sillón, escritorio)' },
      { value: 'versatil' as Mobiliario, label: 'Versátil (yo armo según la sesión)' },
      { value: 'indistinto' as Mobiliario, label: 'Me da lo mismo' },
    ],
  },
];

export default function Quiz({ agendaUrl }: Props) {
  const [step, setStep] = useState(0);
  const [respuestas, setRespuestas] = useState<{
    prof?: ProfesionKey;
    cap?: Capacidad;
    mob?: Mobiliario;
  }>({});

  const handleAnswer = (key: 'prof' | 'cap' | 'mob', value: string) => {
    const nuevas = { ...respuestas, [key]: value };
    setRespuestas(nuevas);
    if (step < preguntas.length - 1) {
      setStep(step + 1);
    } else {
      setStep(preguntas.length); // resultado
    }
  };

  const reset = () => {
    setStep(0);
    setRespuestas({});
  };

  // ─── Resultado ─────────────────────────────────────────────────────
  if (step === preguntas.length) {
    const recs = recomendar(
      respuestas.prof!,
      respuestas.cap!,
      respuestas.mob ?? 'indistinto'
    );

    return (
      <div className="rounded-[var(--radius-xl)] border border-terracota/30 bg-crema p-8 sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">
          Tu recomendación
        </p>
        <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          {recs.length === 1 ? 'Tu espacio ideal' : 'Tus dos mejores opciones'}
        </h3>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {recs.map((r) => (
            <a
              key={r.espacioId}
              href={`/los-espacios/${r.espacioId}`}
              className="group flex flex-col rounded-2xl border border-hairline bg-crema-warm/30 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:bg-crema hover:shadow-md"
            >
              <h4 className="font-display text-2xl text-ink">{r.nombre}</h4>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{r.por_que}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-terracota transition-transform duration-300 group-hover:translate-x-0.5">
                Ver detalles
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={agendaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracota px-7 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracota-dark hover:shadow-md"
          >
            Reservar ahora
          </a>
          <button
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium text-ink-soft transition-colors hover:text-terracota"
          >
            Empezar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // ─── Pregunta activa ────────────────────────────────────────────────
  const p = preguntas[step];
  const progress = ((step + 1) / preguntas.length) * 100;

  return (
    <div className="rounded-[var(--radius-xl)] border border-hairline bg-crema p-8 sm:p-12">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {step + 1} / {preguntas.length}
        </span>
        <div className="flex-1 h-1 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-terracota transition-all duration-500 ease-[var(--ease-out-soft)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="font-display text-3xl text-ink sm:text-4xl">{p.titulo}</h3>

      <div className="mt-8 grid gap-3">
        {p.opciones.map((op) => (
          <button
            key={op.value}
            onClick={() => handleAnswer(p.key, op.value)}
            className="group flex items-center justify-between rounded-2xl border border-hairline bg-crema px-6 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-terracota hover:bg-terracota-tint/40 hover:shadow-sm"
          >
            <span className="text-base font-medium text-ink">{op.label}</span>
            <svg
              className="text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-terracota"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-6 text-sm text-ink-muted transition-colors hover:text-terracota"
        >
          ← Volver
        </button>
      )}
    </div>
  );
}
