import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import MiniCardItem from "./MiniCardItem";

function OrderCard({ id, address, receiver_name, total_price, created_at, produtos = [] }) {
  const [isOpen, setIsOpen] = useState(true);

  // Converter data para formato legível
  const formattedDate = new Date(created_at).toLocaleDateString("pt-PT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="border rounded-xl p-5 bg-gray-50 dark:bg-darkBackground shadow-sm transition-all mb-6">
      {/* Cabeçalho da encomenda */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
        <div>
          <h2 className="text-lg font-semibold dark:text-gray-100">
            Encomenda #{id}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Data: {formattedDate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Entregar a: {receiver_name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total:</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {total_price}€
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              Em processamento
            </p>
          </div>

          {/* Botão dropdown */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </button>
        </div>
      </div>

      {/* Lista de produtos */}
      {isOpen && produtos.length > 0 && (
        <div className="space-y-3 transition-all duration-300 overflow-hidden">
          {produtos.map((item) => (
            <MiniCardItem
              key={`${id}-${item.id}`}
              name={item.name}
              price={item.price}
              image_url={item.image_url}
              quantity={item.quantity}
              readOnly
            />
          ))}
        </div>
      )}

      {isOpen && produtos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          Nenhum produto encontrado nesta encomenda.
        </p>
      )}

      {/* Botões de ação */}
      <div className="mt-5 flex justify-end gap-3">
        <Link
          to="#"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ver detalhes
        </Link>
        <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
          Repetir pedido
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
