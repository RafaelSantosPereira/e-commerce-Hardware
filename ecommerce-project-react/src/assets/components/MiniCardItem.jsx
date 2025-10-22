import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "./contexts/CartContext";

export default function MiniCardItem({
  id,
  name,
  price,
  image_url,
  categoria,
  quantity,
  onRemove, // opcional
  readOnly = false // novo: usado em OrderCard
}) {
  const { deleteItem } = useCart();

  const handleRemove = () => {
    if (onRemove) onRemove(id);
    else deleteItem(id);
  };

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-lg border dark:border-gray-700 
    hover:bg-gray-50 dark:hover:bg-gray-800 
      transition-colors`}
    >
      {/* Botão remover (só mostra se não for readOnly) */}
      {!readOnly && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 w-6 h-6 flex items-center justify-center"
        >
          <X size={18} />
        </button>
      )}

      {/* Imagem */}
      <Link to={`/${categoria}/${id}`} className="flex-shrink-0">
        <img
          src={image_url}
          alt={name}
          className="w-20 h-20 object-contain rounded-md bg-gray-100 dark:bg-gray-800"
        />
      </Link>

      {/* Informações */}
      <div className="flex flex-col flex-grow pr-4">
        <Link
          to={`/${categoria}/${id}`}
          className="hover:text-blue-500 transition-colors"
        >
          <h2 className="text-sm sm:text-base font-medium line-clamp-2 dark:text-gray-200">
            {name}
          </h2>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-500 font-bold">
            €{Number(price || 0).toFixed(2)}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            x{quantity}
          </span>
        </div>
      </div>
    </div>
  );
}
