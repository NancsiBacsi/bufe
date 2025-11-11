interface Props {
  min?: number | null;
  max: number;
  value: number;
  onChange?: (newValue: number) => void | null;
  disabled?: boolean | null;
  id?: string | null;
  required?: boolean | null;
}
export default function ListInputInteger({ min, max, value, onChange, disabled, id, required }: Props) {
  return (
    <input
      type="number"
      min={min ? min : 0}
      max={max}
      step={1}
      value={""+value}
      className={`${max.toString().length < 3 ? "w-8" : "w-16"} border rounded px-2 py-1 text-right`}
      disabled={disabled ? true : false}
      id={id ? id : ""}
      required={required ? true : false }
      onChange={(e) => {
        const num=Number(e.target.value);
        onChange && onChange( isNaN( num ) ? 0 : num );
      }}
    />
  );
}