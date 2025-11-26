interface Props {
  id?: string;
  value: string;
  onChange?: (newValue: string) => void | null;
  required?: boolean | null;
}
export default function FormInputDate({ value, onChange, required, id }: Props) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      className="w-40 border rounded px-2 py-1 text-lg"
      required={required ? true : false }
      onChange={(e) => {
        onChange && onChange( e.target.value );
      }}
    />
  );
}