interface Props {
  title?: string | null;
}
export default function PageTitle({title}:Props) {
  return title
    ? <h2 className="small-caps text-2xl text-center">{title}</h2>
    : null;
}