interface Props {
  title: string;
}
export const FormSubmitButton = ({ title }: Props) => (
  <button 
    className="bg-blue-600 hover:bg-blue-400 text-lg small-caps p-2 text-white rounded cursor-pointer"
    type="submit"
  >
    {title}
  </button>
);