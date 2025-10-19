interface PageContainerProps {
  children: React.ReactNode;
};
export const PageContainer = ({ children }: PageContainerProps) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-100">
    <div className="bg-white p-4 rounded shadow-lg max-w-[400px] w-full flex flex-col">
      {children}
    </div>
  </div>
);