import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductCard = () => {

  useEffect(() => {
    console.log(`ProductCard mounted`)
  }, [])

  return (
    <div className="ProductCard-component">
      Test content
    </div>
  )
}

ProductCard.propTypes = {
  // bla: PropTypes.string,
};

ProductCard.defaultProps = {
  // bla: 'test',
};

export default ProductCard;
