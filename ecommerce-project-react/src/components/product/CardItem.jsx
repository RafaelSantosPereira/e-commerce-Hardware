import { Link } from 'react-router-dom';

function CardItem({ id, name, price, categoria, image_url }) {
  return (
    <Link to={`/${categoria}/${id}`}>
      <div className="border rounded-lg  shadow p-4 bg-white dark:bg-[#1f1f1f] text-left dark:border-0 hover:shadow-lg transition-shadow cursor-pointer">
        <img
          src={image_url}
          alt={name}
          className="mb-4 border-0 rounded-lg"
        />
        
        {/* Nome do produto limitado a 2 linhas */}
        <h2 className="text-xl mb-2 line-clamp-2">
          {name || 'Nome indisponível'}
        </h2>

        <p className="text-xl text-blue-400 font-bold mt-auto">
          Preço: €{price}
        </p>
      </div>
    </Link>
  );
}

export default CardItem;
