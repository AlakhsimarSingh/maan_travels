type Props = {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function AdminPageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: Props) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>

        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="
            rounded-lg
            bg-[#ecb100]
            px-4 py-2
            text-black
            font-medium
            hover:bg-[#f6c94c]
            transition
          "
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}