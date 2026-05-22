/** Throw a readable error if a Supabase query fails */
export function assert<T>(
  data: T | null,
  error: { message: string } | null,
  context: string
): T {
  if (error) throw new Error(`[db/${context}] ${error.message}`);
  if (data === null) throw new Error(`[db/${context}] returned null`);
  return data;
}
