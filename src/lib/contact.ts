/** Primary contact inbox for leads and enquiries. */
export const CONTACT_EMAIL = "klimgym@hotmail.com";

export const YOUTUBE_CHANNEL = "https://www.youtube.com/@MuscleHabit";

/**
 * Form delivery endpoint.
 * Prefer a Formspree form ID via NEXT_PUBLIC_FORMSPREE_ENDPOINT
 * (e.g. https://formspree.io/f/xxxxxx). Falls back to FormSubmit
 * AJAX delivery straight to CONTACT_EMAIL.
 */
export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() ||
  `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export async function submitLeadForm(
  payload: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const body = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      body.append(key, value);
    }
    // FormSubmit helpers (ignored harmlessly by Formspree)
    if (!body.has("_subject")) {
      body.append("_subject", "Muscle Habit website lead");
    }
    body.append("_template", "table");
    body.append("_captcha", "false");

    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: text || `Request failed (${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
