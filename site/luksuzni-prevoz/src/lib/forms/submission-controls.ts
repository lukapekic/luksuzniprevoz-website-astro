/** Prevent edits while a submitted payload is in flight. Preserve conditional disabled states. */
export function lockSubmissionControls(form: HTMLFormElement): () => void {
  const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"));
  const states = controls.map((control) => control.disabled);
  for (const control of controls) control.disabled = true;
  return () => controls.forEach((control, index) => { control.disabled = states[index] ?? false; });
}
