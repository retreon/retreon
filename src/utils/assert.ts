// Because package dependencies are a pain to maintain.
export default function assert<Condition>(
  condition: Condition,
  message: string,
) {
  if (!condition) throw new Error(message);
}
