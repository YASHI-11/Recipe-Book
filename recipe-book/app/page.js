"use client";
import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Star, ChefHat, Heart, Filter, TrendingUp, Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RecipeHomepage = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

 useEffect(() => {
  
  const fetchData = async () => {
    try {
      const res = await fetch("/api/get-recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("yaha error ",err);
    }
  };
  fetchData();
  setIsLoaded(true);
}, []);
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Enter functionality can be added here if needed in the future
    }
  };

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Beverages'];



  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (recipeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

if (!isLoaded) {
  console.log(recipes);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Recipe Detail View */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{selectedRecipe.title}</h1>
                  <div className="flex items-center gap-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {selectedRecipe.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedRecipe.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Recipe Info */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Prep Time</div>
                    <div className="font-semibold">{selectedRecipe.prepTime || '15 min'}</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Cook Time</div>
                    <div className="font-semibold">{selectedRecipe.cookTime}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Servings</div>
                    <div className="font-semibold">{selectedRecipe.servings}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <ChefHat className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Difficulty</div>
                    <div className="font-semibold">{selectedRecipe.difficulty}</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Ingredients */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      Ingredients
                    </h2>
                    <div className="space-y-3">
                      {selectedRecipe.ingredients?.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">{ingredient}</span>
                        </div>
                      )) || (
                          <p className="text-gray-500 italic">Ingredients not available for this recipe.</p>
                        )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="lg:col-span-3">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      Instructions
                    </h2>
                    <div className="space-y-4">
                      {selectedRecipe.instructions?.map((instruction, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed">{instruction}</p>
                          </div>
                        </div>
                      )) || (
                          <p className="text-gray-500 italic">Instructions not available for this recipe.</p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => toggleFavorite(selectedRecipe.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${favorites.has(selectedRecipe.id)
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(selectedRecipe.id) ? 'fill-current' : ''}`} />
                    {favorites.has(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}
                  </button>

                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105">
                    Contact Chef
                  </button>

                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-200 transition-all duration-300 hover:scale-105">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    Share Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <ChefHat className="w-16 h-16 animate-bounce" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              FlavorBook
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Discover, cook, and share amazing recipes from around the world. Your culinary adventure starts here.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => router.push('/add')}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25"
              >
                <Plus className="w-6 h-6" />
                Add Your Recipe
              </button>

              <button
                onClick={() => {
                  const recipesSection = document.getElementById('recipes-section');
                  if (recipesSection) {
                    recipesSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25"
              >
                <ChefHat className="w-6 h-6" />
                Browse Recipes
              </button>
            </div>
          </div>
        </div>

        {/* Floating Recipe Cards Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`absolute w-20 h-20 bg-white/10 backdrop-blur-sm rounded-lg animate-float-${i}`}
              style={{
                left: `${20 + i * 25}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ChefHat, number: '1,000+', label: 'Recipes' },
              { icon: Users, number: '50K+', label: 'Home Cooks' },
              { icon: Star, number: '4.9', label: 'Average Rating' },
              { icon: TrendingUp, number: '100+', label: 'New Weekly' }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 group-hover:shadow-xl transition-shadow duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter and Search */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-3 rounded-full bg-white border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <Filter className="w-6 h-6 text-gray-600 self-center" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes-section" className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
            {selectedCategory === 'All' ? 'Featured Recipes' : `${selectedCategory} Recipes`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 ${favorites.has(recipe.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                        } transition-colors duration-300`}
                    />
                  </button>
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {recipe.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No recipes found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated with New Recipes</h2>
          <p className="text-xl mb-8 text-orange-100">Get weekly recipe updates and cooking tips directly to your inbox</p>

          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(15deg); }
        }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RecipeHomepage;