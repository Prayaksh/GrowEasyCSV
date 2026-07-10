interface ParseButtonProps {
  loading: boolean;
  onClick: () => void | Promise<void>;
}

export default function ParseButton({ loading, onClick }: ParseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Parsing..." : "Parse File"}
    </button>
  );
}
