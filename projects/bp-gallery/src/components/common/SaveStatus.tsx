export const SaveStatus = ({ label, className }: { label: string; className?: string }) => {
  return (
    <span
      className={`text-[#5a5a5a] bg-[#e5e5e5] rounded py-2 px-3 ${className ?? ''}`}
      data-testid='save-status'
    >
      {label}
    </span>
  );
};
