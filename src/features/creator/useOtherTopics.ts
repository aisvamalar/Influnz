/**
 * "Other" topic support for the creator category pickers.
 *
 * The preset topics are plain chips. "Other" is one extra chip that reveals a
 * text box; whatever the creator types (comma separated) is stored in the same
 * `categories` list as the presets, so brands filter on custom topics too.
 */
import { useState } from 'react';

export const OTHER_MAX_TOPICS = 5;
export const OTHER_MAX_LENGTH = 30;

/** "Pets, Gardening ,pets" → ["Pets", "Gardening"] (trimmed, capped, de-duplicated, not a preset). */
export function parseOtherTopics(text: string, presets: string[]): string[] {
  const seen = new Set(presets.map(p => p.toLowerCase()));
  const out: string[] = [];
  for (const raw of text.split(',')) {
    const topic = raw.trim().replace(/\s+/g, ' ').slice(0, OTHER_MAX_LENGTH).trim();
    if (!topic || seen.has(topic.toLowerCase())) continue;
    seen.add(topic.toLowerCase());
    out.push(topic);
    if (out.length === OTHER_MAX_TOPICS) break;
  }
  return out;
}

export function useOtherTopics(
  presets: string[],
  categories: string[],
  setCategories: (next: string[]) => void,
) {
  const initialCustom = categories.filter(c => !presets.includes(c));
  const [otherOn, setOtherOn] = useState(initialCustom.length > 0);
  const [otherText, setOtherText] = useState(initialCustom.join(', '));

  const selectedPresets = categories.filter(c => presets.includes(c));

  const commit = (nextPresets: string[], on: boolean, text: string) => {
    setCategories([...nextPresets, ...(on ? parseOtherTopics(text, presets) : [])]);
  };

  const togglePreset = (topic: string) => {
    const next = selectedPresets.includes(topic)
      ? selectedPresets.filter(c => c !== topic)
      : [...selectedPresets, topic];
    commit(next, otherOn, otherText);
  };

  const toggleOther = () => {
    const on = !otherOn;
    setOtherOn(on);
    commit(selectedPresets, on, otherText);
  };

  const changeOtherText = (text: string) => {
    setOtherText(text);
    commit(selectedPresets, otherOn, text);
  };

  return { otherOn, otherText, selectedPresets, togglePreset, toggleOther, changeOtherText };
}
