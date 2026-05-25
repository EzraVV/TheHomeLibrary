//Take an array of interests, create string for db
export function stringifyInterests(interests: string[]): string {
  if (!Array.isArray(interests)) return '';
  return interests
    .map(i => i.trim())
    .filter(Boolean)
    .join(',');
} 

//Take flat DB string and create interest units for tags, linking etc.
export function atomizeInterests(interestsString: string | null | undefined): string[] {
  if (!interestsString) return [];
  return interestsString
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);
}