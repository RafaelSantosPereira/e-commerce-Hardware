import { useParams } from 'react-router-dom';



function CategoryPage(){

    const { categoria } = useParams();

  return (

    <div className="min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground text-center">

     
        <h1 className="text-2xl font-bold capitalize ">{categoria.replace('-', ' ')}</h1>
        <p className="mt-4">Página da categoria: <strong>{categoria}</strong></p>
      


    </div>

    
  );
}

export default CategoryPage;
