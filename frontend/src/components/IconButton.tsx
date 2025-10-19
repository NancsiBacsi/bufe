interface Props {
  icon: React.ReactNode;
  onClick?: () => void | Promise<void>
  title?: string;
}
export default function IconButton({ icon, onClick, title }: Props) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex p-3 cursor-pointer items-center justify-center rounded bg-gray-400 hover:bg-gray-200 shadow-lg">
      {icon}
    </button>
  );
}