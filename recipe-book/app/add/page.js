"use client";
import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, Minus, Clock, Users, ChefHat, Star, Camera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";

const AddRecipePage = () => {
    const router = useRouter();
    const [recipeData, setRecipeData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        ingredients: [''],
        instructions: [''],
        tags: [],
        image: null
    });

    const [currentTag, setCurrentTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Beverages', 'Appetizers'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const handleInputChange = (field, value) => {
        setRecipeData(prev => ({ ...prev, [field]: value }));
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...recipeData.ingredients];
        newIngredients[index] = value;
        setRecipeData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addIngredient = () => {
        setRecipeData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, '']
        }));
    };

    const removeIngredient = (index) => {
        if (recipeData.ingredients.length > 1) {
            const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
            setRecipeData(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...recipeData.instructions];
        newInstructions[index] = value;
        setRecipeData(prev => ({ ...prev, instructions: newInstructions }));
    };

    const addInstruction = () => {
        setRecipeData(prev => ({
            ...prev,
            instructions: [...prev.instructions, '']
        }));
    };

    const removeInstruction = (index) => {
        if (recipeData.instructions.length > 1) {
            const newInstructions = recipeData.instructions.filter((_, i) => i !== index);
            setRecipeData(prev => ({ ...prev, instructions: newInstructions }));
        }
    };

    const addTag = () => {
        if (currentTag.trim() && !recipeData.tags.includes(currentTag.trim())) {
            setRecipeData(prev => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setRecipeData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecipeData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            let imageBase64 = null;

            if (recipeData.image) {
                const reader = new FileReader();
                imageBase64 = await new Promise((resolve) => {
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(recipeData.image);
                });
            }

            const payload = { ...recipeData, image: imageBase64 ,id: uuidv4() };

            const res = await fetch("/api/add-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add recipe");

            alert("Recipe submitted successfully! 🎉");
            setRecipeData({
                title: "",
                description: "",
                category: "",
                difficulty: "",
                prepTime: "",
                cookTime: "",
                servings: "",
                ingredients: [""],
                instructions: [""],
                tags: [],
                image: null,
            });
            setImagePreview(null);
            router.push("/");
        } catch (err) {
            console.error("Submit error:", err);
            alert("Something went wrong. Try again!");
        }

        setIsSubmitting(false);
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Add New Recipe</h1>
                                <p className="text-gray-600">Share your culinary creation with the world</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-8 h-8 text-orange-500" />
                            <span className="text-xl font-bold text-gray-800">FlavorBook</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-8">
                    {/* Recipe Image */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Camera className="w-6 h-6 text-orange-500" />
                            Recipe Photo
                        </h2>

                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Recipe preview"
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setRecipeData(prev => ({ ...prev, image: null }));
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 cursor-pointer transition-colors duration-200">
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-orange-500">
                                        <Upload className="w-12 h-12 mb-4" />
                                        <p className="text-lg font-medium">Upload Recipe Photo</p>
                                        <p className="text-sm">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Title *
                                </label>
                                <input
                                    type="text"
                                    value={recipeData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                    placeholder="Enter recipe title..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={recipeData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                    placeholder="Describe your recipe..."
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={recipeData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty *
                                    </label>
                                    <select
                                        value={recipeData.difficulty}
                                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Select difficulty</option>
                                        {difficulties.map(difficulty => (
                                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Prep Time *
                                    </label>
                                    <input
                                        type="text"
                                        value={recipeData.prepTime}
                                        onChange={(e) => handleInputChange('prepTime', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                        placeholder="e.g., 15 min"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Cook Time *
                                    </label>
                                    <input
                                        type="text"
                                        value={recipeData.cookTime}
                                        onChange={(e) => handleInputChange('cookTime', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                        placeholder="e.g., 30 min"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Servings *
                                    </label>
                                    <input
                                        type="number"
                                        value={recipeData.servings}
                                        onChange={(e) => handleInputChange('servings', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                        placeholder="4"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Ingredients</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Add Ingredient
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recipeData.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                            placeholder={`Ingredient ${index + 1}...`}
                                            required
                                        />
                                    </div>
                                    {recipeData.ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Instructions</h2>
                            <button
                                type="button"
                                onClick={addInstruction}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Add Step
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recipeData.instructions.map((instruction, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mt-2">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={instruction}
                                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                            placeholder={`Step ${index + 1} instructions...`}
                                            required
                                        />
                                    </div>
                                    {recipeData.instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 mt-2"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Tags</h2>

                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                placeholder="Add tags (e.g., vegetarian, quick, healthy)..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-200"
                            >
                                Add
                            </button>
                        </div>

                        {recipeData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {recipeData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-600 transition-colors duration-200"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Publishing...
                                </div>
                            ) : (
                                'Publish Recipe'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRecipePage;