import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "./contexts/CartContext";

export default function MiniCardItem({ id, name, price, image_url, categoria, quantity, onRemove }) {
  
  const { deleteItem } = useCart();

  return (
    <div className="relative flex items-start gap-4 p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      
      {/* Botão remover no canto superior direito */}
      <button
         onClick={() => deleteItem(id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 w-6 h-6 flex items-center justify-center"
      >
        <X size={18} />
      </button>

      {/* Imagem maior */}
      <Link to={`/${categoria}/${id}`} className="flex-shrink-0">
        <img
          src={image_url}
          alt={name}
          className="w-24 h-24 object-contain rounded-md bg-gray-100 dark:bg-gray-800"
        />
      </Link>

      {/* Informações do produto */}
      <div className="flex flex-col flex-grow pr-4"> {/* padding à direita para o X */}
        <Link to={`/${categoria}/${id}`} className="hover:text-blue-500 transition-colors">
          <h2 className="text-sm sm:text-base font-medium line-clamp-2 dark:text-gray-200">
            {name}
          </h2>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-500 font-bold">
            €{typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">x{quantity}</span>
        </div>
      </div>
    </div>
  );
}
