interface Props {
  error?: string | null;
}
export default function ErrorLine({error}:Props) {
  return error ? <p className="text-red-600">{error}</p> : null;
}