// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true , unique: true },
//         description: { type: String, required: true },
//         price: { type: Number, required: true },
//         image: { type: String, required: true },
//         catagories: { type: Array },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }, // This will be the preview thumbnail
        categories: { type: Array }, // Fixed the spelling from 'catagories'
        
        // --- New DevSnippet Fields ---
        language: { 
            type: String, 
            required: true, 
            default: "javascript" 
        }, // e.g., 'jsx', 'typescript', 'tailwind'
        
        codeContent: { 
            type: String, 
            required: true 
        }, // The actual code string the user is buying
        
        previewUrl: { 
            type: String 
        }, // Optional: Link to a live demo (Vercel/Netlify)
        
        purchaseCount: { 
            type: Number, 
            default: 0 
        } // Good for showing "Popular" snippets
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);