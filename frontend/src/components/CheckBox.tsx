interface Props {
  title: string;
  checked: boolean;
  onChanged: (newValue: boolean) => void;
}
export default function CheckBox({title, checked, onChanged}:Props) {
  return (
    <div className="box-border w-full bottom-4 rounded shadow bg-white text-center">
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChanged(e.target.checked)}
        />
        &nbsp;{title}
      </label>
    </div>
  );
}