import FormatedTxt from "./FormatedText";

interface Props {
  title: string;
  onClick?: () => void;
  disabled?: boolean | null;
  className?: string | null;
}

export default function ListButton({ title, onClick, disabled, className }: Props) {
  return (
    <button onClick={onClick}
      className={`w-full p-3 cursor-pointer text-base rounded-md bg-gray-400 hover:bg-gray-200 shadow-l ${className?className:''}`}
      disabled={disabled ? true : false}>
      <FormatedTxt formatedTxt={title} className="" key={1}/>
    </button>
  );
}