interface Props {
  id?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange?: (newValue: string) => void | null;
  required?: boolean | null;
}
export default function FormInputString({ type, placeholder, value, onChange, required, id }: Props) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      className="w-full border rounded px-2 py-1 text-lg"
      required={required ? true : false }
      onChange={(e) => {
        onChange && onChange( e.target.value );
      }}
    />
  );
}