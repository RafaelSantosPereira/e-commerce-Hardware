import { useCart } from "../contexts/CartContext";
import MiniCardItem from "../MiniCardItem";
import { idParaCategoria } from "@/assets/export_files/idParaCategoria";

function Cart() {
  const { cartItems, totalPrice, deleteItem } = useCart();

  return (
    <div className="flex w-full p-6 gap-6">
      {/* lista de produtos */}
      <div className="w-2/3 bg-gray-100 dark:bg-[#1f1f1f] p-4 rounded-lg">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">O carrinho está vazio</p>
        ) : (
          <ul className="space-y-4">
                {cartItems.map((item) => (
                <MiniCardItem
                  key={item.product_id || item.id}
                  id={item.product_id || item.id}
                  name={item.name}
                  price={item.price}
                  image_url={item.image_url}
                  categoria={idParaCategoria[item.category_id]}
                  quantity={item.quantity}
                />
              ))}
          </ul>
        )}
      </div>

      {/* info cart */}
      <div className="w-1/3 bg-gray-200 dark:bg-[#121212] p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Resumo</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Total: <span className="font-bold">€{totalPrice.toFixed(2)}</span>
        </p>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}

export default Cart;
