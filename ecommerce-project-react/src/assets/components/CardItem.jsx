import ryzenImg from '../images/168-amd-ryzen-7-5800x-38ghz.webp';
import { Link } from 'react-router-dom';

function CardItem({ id, name, price, categoria }) {
  return (
    <Link to={`/${categoria}/${id}`}>
      <div className="border rounded-lg shadow p-4 bg-white dark:bg-[#1f1f1f] text-left dark:border-0 hover:shadow-lg transition-shadow cursor-pointer">
        <img
          src={ryzenImg}
          alt={name}
          className="mb-4 border rounded-lg"
        />
        <h2 className="text-xl mb-2">{name || 'Nome indisponível'}</h2>
        <p className="text-xl text-blue-400 font-bold">
          Preço: {typeof price === 'number' ? `€${price.toFixed(2)}` : 'Preço indisponível'}
        </p>
      </div>
    </Link>
  );
}

export default CardItem;
