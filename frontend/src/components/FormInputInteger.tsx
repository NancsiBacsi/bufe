interface Props {
  id?: string;
  placeholder: string;
  value: number;
  min: number;
  max: number;
  onChange?: (newValue: number) => void | null;
  required?: boolean | null;
}
export default function FormInputInteger({ placeholder, value, min, max, onChange, required, id }: Props) {
  return (
    <input
      id={id}
      type="number"
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      step="1"
      className={`${max.toString().length < 3 ? "w-8" : "w-20"} border rounded px-2 py-1 text-lg`}
      required={required ? true : false }
      onChange={(e) => {
        onChange && onChange( Number( e.target.value ) );
      }}
    />
  );
}