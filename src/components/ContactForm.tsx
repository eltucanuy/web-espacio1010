import { useState } from 'react';

/**
 * Form de contacto. v1: arma un WhatsApp pre-rellenado y abre la conversación.
 * Cero backend, captura inmediata, response time alto.
 *
 * v1.5 (opcional): postear paralelo a Supabase `leads` para tener registro
 * histórico aunque el usuario nunca termine la conversación.
 */

interface Props {
  whatsappNumber: string; // Formato E.164 sin "+", ej: "59891000000"
}

const PROFESIONES = [
  'Psicología',
  'Psiquiatría',
  'Psicopedagogía',
  'Nutrición',
  'Coaching',
  'Constelaciones familiares',
  'Homeopatía',
  'Masajes / corporal',
  'Meditación / yoga',
  'Taller o grupo',
  'Otra',
];

const USOS = [
  { value: 'eventual', label: 'Hora suelta / eventual' },
  { value: 'fija', label: 'Día y hora fijos semanales' },
  { value: 'sala', label: 'Sala grupal / taller' },
  { value: 'visita', label: 'Visita guiada al lugar' },
  { value: 'otra', label: 'Otra consulta' },
];

export default function ContactForm({ whatsappNumber }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sin tipar explícito el evento — React 19 movió los types y los nombres
  // re-exportados están deprecated. El handler se valida por shape.
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const nombre = (data.get('nombre') as string)?.trim();
    const profesion = (data.get('profesion') as string)?.trim();
    const uso = (data.get('uso') as string)?.trim();
    const mensaje = ((data.get('mensaje') as string) || '').trim();

    if (!nombre || !profesion || !uso) {
      setError('Completá nombre, profesión y tipo de consulta.');
      setSubmitting(false);
      return;
    }

    const usoLabel = USOS.find((u) => u.value === uso)?.label ?? uso;

    const texto =
      `Hola, soy ${nombre}.\n\n` +
      `Profesión: ${profesion}\n` +
      `Tipo de consulta: ${usoLabel}\n\n` +
      (mensaje ? `${mensaje}\n\n` : '') +
      `(Llego desde el sitio web)`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texto)}`;

    // Abrimos WhatsApp en nueva pestaña / app nativa según device.
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Tu nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          className="block w-full rounded-xl border border-hairline bg-crema px-4 py-3 text-base text-ink outline-none transition-colors focus:border-terracota focus:ring-0"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="profesion" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Profesión
          </label>
          <select
            id="profesion"
            name="profesion"
            required
            defaultValue=""
            className="block w-full rounded-xl border border-hairline bg-crema px-4 py-3 text-base text-ink outline-none transition-colors focus:border-terracota"
          >
            <option value="" disabled>
              Elegí una
            </option>
            {PROFESIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="uso" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Tipo de consulta
          </label>
          <select
            id="uso"
            name="uso"
            required
            defaultValue=""
            className="block w-full rounded-xl border border-hairline bg-crema px-4 py-3 text-base text-ink outline-none transition-colors focus:border-terracota"
          >
            <option value="" disabled>
              Elegí una
            </option>
            {USOS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Algo que querés agregar <span className="font-normal text-ink-muted normal-case tracking-normal">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Si tenés una pregunta específica, contanos acá."
          className="block w-full resize-y rounded-xl border border-hairline bg-crema px-4 py-3 text-base text-ink outline-none transition-colors focus:border-terracota"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracota px-7 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracota-dark hover:shadow-[0_12px_32px_-8px_rgba(158,78,66,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Abriendo WhatsApp…' : 'Enviar por WhatsApp'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 6.3A7.85 7.85 0 0012.05 4a7.94 7.94 0 00-6.78 12L4 20l4.1-1.07a7.93 7.93 0 003.95 1h.01c4.36 0 7.91-3.55 7.91-7.91 0-2.11-.82-4.1-2.37-5.72zm-5.55 12.16h-.01a6.58 6.58 0 01-3.36-.92l-.24-.14-2.43.64.65-2.37-.16-.25a6.55 6.55 0 01-1-3.5c0-3.63 2.95-6.58 6.58-6.58 1.76 0 3.4.68 4.64 1.93a6.55 6.55 0 011.93 4.65c0 3.62-2.96 6.54-6.6 6.54zm3.6-4.93c-.2-.1-1.17-.58-1.35-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.43.05a5.41 5.41 0 01-1.59-.98 6 6 0 01-1.1-1.37c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.39-.01a.74.74 0 00-.54.25c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.17 3.44 3.04.48.21.86.33 1.15.43.48.15.92.13 1.27.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.06-.1-.18-.16-.39-.27z" />
          </svg>
        </button>
        <p className="text-xs text-ink-muted">
          Tu mensaje se abre en WhatsApp listo para enviar. No guardamos tus datos hasta que vos los mandes.
        </p>
      </div>
    </form>
  );
}
