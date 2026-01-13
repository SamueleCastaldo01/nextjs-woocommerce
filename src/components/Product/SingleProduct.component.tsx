// Imports
import { useState, useEffect } from 'react';

// Utils - Ho rimosso paddedPrice perché sporca il prezzo con "kr"
import { filteredVariantPrice } from '@/utils/functions/functions';

// Components
import AddToCart, { IProductRootObject } from './AddToCart.component';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.component';

const SingleProduct = ({ product }: IProductRootObject) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVariation, setSelectedVariation] = useState<number>();

  const placeholderFallBack = 'https://via.placeholder.com/600';

  useEffect(() => {
    setIsLoading(false);
    if (product.variations) {
      const firstVariant = product.variations.nodes[0].databaseId;
      setSelectedVariation(firstVariant);
    }
  }, [product.variations]);

  let { description, image, name, onSale, price, regularPrice, salePrice } = product;

  // FUNZIONE PER PULIRE IL PREZZO (Rimuove &nbsp; e simboli strani)
  const cleanPrice = (priceStr: string | null) => {
    if (!priceStr) return '';
    // Rimuove &nbsp;, spazi unificati e pulisce il formato
    return priceStr.replace(/&nbsp;|\u00a0/g, ' ').trim();
  };

  // Strip out HTML from description
  let DESCRIPTION_WITHOUT_HTML = "";
  if (process.browser && description) {
    DESCRIPTION_WITHOUT_HTML = new DOMParser().parseFromString(
      description,
      'text/html',
    ).body.textContent || "";
  }

  return (
    <section className="bg-white mb-12 min-h-screen">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-xl font-medium mb-4">Caricamento prodotto...</p>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12 items-start">
            
            {/* Foto Prodotto */}
            <div className="w-full mb-8 md:mb-0">
              <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                <img
                  id="product-image"
                  src={image?.sourceUrl || placeholderFallBack}
                  alt={name}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Dettagli Prodotto */}
            <div className="flex flex-col w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {name}
              </h1>

              {/* Display Prezzo Pulito */}
              <div className="mb-8">
                {onSale ? (
                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-bold text-red-600">
                      {cleanPrice(product.variations ? filteredVariantPrice(price, '') : salePrice)}
                    </p>
                    <p className="text-xl text-gray-400 line-through">
                      {cleanPrice(product.variations ? filteredVariantPrice(price, 'right') : regularPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {cleanPrice(price)}
                  </p>
                )}
              </div>

              {/* Descrizione */}
              <div className="prose prose-slate mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {DESCRIPTION_WITHOUT_HTML}
                </p>
              </div>

              {/* Disponibilità Magazzino */}
              {product.stockQuantity && product.stockQuantity > 0 && (
                <div className="mb-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ● {product.stockQuantity} disponibili in magazzino
                  </span>
                </div>
              )}

              {/* Selezione Varianti (es. Colore o Pacco) */}
              {product.variations && (
                <div className="mb-8 w-full max-w-sm">
                  <label htmlFor="variant" className="block text-sm font-semibold text-gray-700 mb-2">
                    Opzioni disponibili
                  </label>
                  <select
                    id="variant"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    onChange={(e) => setSelectedVariation(Number(e.target.value))}
                  >
                    {product.variations.nodes.map(({ id, name, databaseId, stockQuantity }) => (
                      <option key={id} value={databaseId}>
                        {name.split('- ').pop()} ({stockQuantity} disp.)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tasto Carrello */}
              <div className="w-full max-w-sm pt-4">
                <AddToCart 
                  product={product} 
                  variationId={selectedVariation} 
                  fullWidth={true} 
                />
              </div>

              <p className="mt-6 text-sm text-gray-400">
                Spedizione rapida per tutti i tuoi prodotti Harry Potter e plettri.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SingleProduct;