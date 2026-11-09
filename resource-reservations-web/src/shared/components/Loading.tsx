import { LoaderCircle } from "lucide-react";

interface Props {
  message?: string;
}

export const Loading = ({
  message = "Cargando, por favor espere...",
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100">
      <button
        type="button"
        className="bg-blue-700 text-white flex justify-center items-center gap-1.5 rounded-lg p-3"
      >
        <LoaderCircle className="animate-spin" />
        {message}
      </button>
    </div>
  );
};
