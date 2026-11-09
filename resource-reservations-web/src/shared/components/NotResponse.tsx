import { RotateCcw } from "lucide-react";

interface Props {
  message?: string;
  onRetry: () => void;
}

export const NotResponse = ({
  message = "No pudimos conectar con el servidor",
  onRetry,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg">
        <p className="text-lg font-medium text-center mb-3">{message}</p>
        <div className="flex justify-center">
          <button
            className="bg-blue-400 text-white flex justify-center items-center gap-1.5 rounded px-3 py-2 hover:bg-blue-500"
            onClick={onRetry}
          >
            Reintentar
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
