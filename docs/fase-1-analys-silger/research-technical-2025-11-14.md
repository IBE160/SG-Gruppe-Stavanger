# Technical Research Report

**Date:** 2025-11-14
**Research Type:** Technical

## 1. Research Goal

This document will capture the findings of our technical research. The specific goals and areas of investigation will be defined in the following steps.

### Technical Question:
Explore AI technologies and approaches suitable for implementing advanced features in the "Smart Food & Recipe Platform" during Phase 2 and beyond. This includes:
*   AI-powered ingredient substitutions (e.g., "Creative Mode").
*   AI-enhanced semantic search for recipes.
*   AI for creative recipe variations.
*   Potentially smart shopping suggestions based on user patterns.

### Project Context:
*   **Application Type:** New mobile-responsive web application.
*   **Frameworks/Technologies:** Next.js 14 (App Router), Tailwind CSS, Supabase (PostgreSQL), Prisma, NextAuth.js.
*   **Hosting:** Vercel (frontend + API), Supabase cloud (database).
*   **AI Integration Timeline:** AI features are explicitly planned for Phase 2 (Post-MVP).
*   **Recipe Source:** Spoonacular API.
*   **User Skill Level:** Beginner.

### Current Knowledge/Ideas:
*   Considering GPT for ingredient substitutions and creative recipe variations.
*   Considering OpenAI's `text-embedding-3-small` for semantic search.

## 2. Technical Requirements and Constraints

### Functional Requirements:
*   The AI must be able to process recipe data from the Spoonacular API.
*   The AI should be able to identify and display sales on food stores relevant to the user's shopping list.
*   The AI should facilitate adding items to the shopping list.
*   The AI must be able to find suitable substitutes for ingredients in recipes.
*   The AI should maintain a positive tone and assist the user in managing their pantry, reducing food waste, and tracking money saved.

### Non-Functional Requirements:
*   **Performance:** AI responses (like substitutions) should be provided within a few seconds.
*   **Scalability:** The system should initially support over 100 users and be designed to handle future growth.
*   **Reliability and Availability:** The AI features must be available whenever the application is in use, with a high degree of accuracy in its suggestions.
*   **Maintainability and Developer Experience:** The AI integration should be easy to update, monitor, and extend with new features.

### Constraints:
*   **Budget:** All services used, including AI, must operate within a free tier. This is a critical constraint for technology selection.
*   **Existing Stack:** Integration with Next.js (TypeScript), Vercel, and Supabase.
*   **Team Expertise:** Solutions should be manageable for a beginner skill level.
*   **Timeline:** AI features are targeted for Phase 2 (post-MVP).
*   **Open Source/Commercial:** Preference for free tier solutions, which may lean towards open-source or very generous free tiers of commercial services.

## 3. Discover and Evaluate Technology Options

### Part A: OpenAI Integration Guide (Paid beyond Free Credits)

This approach uses OpenAI's API for convenience and high-quality embeddings. Remember, this will use your initial free credits and then become a paid service.

#### **Step A1: Environment Setup**

1.  **Install Libraries:**
    In your Next.js project, install the Supabase and OpenAI client libraries:
    ```bash
    npm install @supabase/supabase-js openai
    ```

2.  **Get API Keys:**
    *   **Supabase:** In your Supabase project dashboard, go to `Project Settings` > `API`. You'll need the `Project URL` and the `service_role` key.
    *   **OpenAI:** Get your API key from the [OpenAI Platform](https://platform.openai.com/api-keys).

3.  **Store Environment Variables:**
    Create a file named `.env.local` in the root of your Next.js project and add your keys. This keeps them secure.
    ```
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

    # OpenAI
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    ```

#### **Step A2: Database Preparation**

You'll need to run some SQL commands in your Supabase project to enable vector support and create the necessary table and search function. You can do this by going to the **SQL Editor** in your Supabase dashboard.

1.  **Enable `pgvector` Extension:**
    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    ```

2.  **Create a Table for Your Recipes:**
    ```sql
    CREATE TABLE recipes (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title TEXT,
      ingredients TEXT,
      content TEXT, -- This could be instructions or a summary
      embedding VECTOR(1536)
    );
    ```

3.  **Create a Search Function:**
    ```sql
    CREATE OR REPLACE FUNCTION match_recipes (
      query_embedding VECTOR(1536),
      match_threshold FLOAT,
      match_count INT
    )
    RETURNS TABLE (
      id BIGINT,
      title TEXT,
      ingredients TEXT,
      content TEXT,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        recipes.id,
        recipes.title,
        recipes.ingredients,
        recipes.content,
        1 - (recipes.embedding <=> query_embedding) AS similarity
      FROM recipes
      WHERE 1 - (recipes.embedding <=> query_embedding) > match_threshold
      ORDER BY similarity DESC
      LIMIT match_count;
    END;
    $$;
    ```

#### **Step A3: Generating and Storing Embeddings**

This is typically done in a backend script or a Next.js API route. You would run this once to "seed" your database with recipes from the Spoonacular API.

Example Next.js API route (`pages/api/seed-recipes.js`):

```javascript
// pages/api/seed-recipes.js
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // --- 1. Get Recipe Data (Example) ---
  const recipesToSeed = [
    {
      title: 'Spaghetti Carbonara',
      ingredients: 'Spaghetti, Eggs, Pancetta, Parmesan, Pepper',
      content: 'A classic Roman pasta dish. Creamy, rich, and ready in 30 minutes.'
    },
    {
      title: 'Chicken Tikka Masala',
      ingredients: 'Chicken, Yogurt, Tomato Puree, Garam Masala, Cream',
      content: 'A popular Indian curry with grilled chicken in a spiced tomato sauce.'
    }
  ];

  // --- 2. Generate Embeddings and Format for Supabase ---
  for (const recipe of recipesToSeed) {
    const embeddingText = `Title: ${recipe.title}; Ingredients: ${recipe.ingredients}; Description: ${recipe.content}`;

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: embeddingText,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // --- 3. Store in Supabase ---
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        title: recipe.title,
        ingredients: recipe.ingredients,
        content: recipe.content,
        embedding: embedding,
      });

    if (error) {
      console.error('Error inserting recipe:', error);
    } else {
      console.log('Inserted recipe:', data);
    }
  }

  res.status(200).json({ message: 'Successfully seeded recipes!' });
}
```

#### **Step A4: Implementing the Search API Route**

Example Next.js API route (`pages/api/search-recipes.js`):

```javascript
// pages/api/search-recipes.js
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // 1. Generate an embedding for the user's search query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // 2. Call the Supabase database function to find matching recipes
  const { data: recipes, error } = await supabase.rpc('match_recipes', {
    query_embedding: queryEmbedding,
    match_threshold: 0.78,
    match_count: 5,
  });

  if (error) {
    console.error('Error matching recipes:', error);
    return res.status(500).json({ error: 'Failed to find matching recipes' });
  }

  // 3. Return the matched recipes
  res.status(200).json(recipes);
}
```

#### **Step A5: Building the Frontend Search Page**

Example Next.js page (`pages/search.js`):

```javascript
// pages/search.js
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    const response = await fetch('/api/search-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });

    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recipe Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., a creamy pasta dish"
          style={{ width: '300px', padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {results.map((recipe) => (
          <div key={recipe.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h2>{recipe.title}</h2>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Similarity Score:</strong> {recipe.similarity.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Part B: Open-Source Integration Guide (Truly Free Tier)

This approach uses a free, open-source model to generate embeddings, which you host yourself. This aligns with the "free tier only" constraint but requires more setup. We'll use the popular `all-MiniLM-L6-v2` model as our example.

#### **Step B1: Environment Setup**

1.  **Install `transformers.js`:**
    In your Next.js project, install the library:
    ```bash
    npm install @huggingface/transformers
    ```
    *(You should already have `@supabase/supabase-js` installed from Part A).*

2.  **Environment Variables:**
    Your Supabase keys in `.env.local` are all you need for this approach. No OpenAI key is necessary.

#### **Step B2: Database Preparation (Adjusted for Open-Source Model)**

This is very similar to Part A, but we need to adjust the database to match the specific open-source model we're using (`Xenova/all-MiniLM-L6-v2`). The main difference is the **vector dimension** (`384`).

In your Supabase **SQL Editor**, you would run these updated commands:

1.  **Enable `pgvector` Extension:** (If you haven't already)
    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    ```

2.  **Create a Table for Your Recipes:**
    ```sql
    CREATE TABLE recipes_os (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title TEXT,
      ingredients TEXT,
      content TEXT,
      embedding VECTOR(384)
    );
    ```

3.  **Create a Search Function:**
    ```sql
    CREATE OR REPLACE FUNCTION match_recipes_os (
      query_embedding VECTOR(384),
      match_threshold FLOAT,
      match_count INT
    )
    RETURNS TABLE (
      id BIGINT,
      title TEXT,
      ingredients TEXT,
      content TEXT,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        recipes_os.id,
        recipes_os.title,
        recipes_os.ingredients,
        recipes_os.content,
        1 - (recipes_os.embedding <=> query_embedding) AS similarity
      FROM recipes_os
      WHERE 1 - (recipes_os.embedding <=> query_embedding) > match_threshold
      ORDER BY similarity DESC
      LIMIT match_count;
    END;
    $$;
    ```

#### **Step B3: Generating and Storing Embeddings with `transformers.js`**

Example Next.js API route (`pages/api/seed-recipes-os.js`):

```javascript
// pages/api/seed-recipes-os.js
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@huggingface/transformers';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class EmbeddingPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export default async function handler(req, res) {
  // --- 1. Get Recipe Data (Example) ---
  const recipesToSeed = [
    {
      title: 'Spaghetti Carbonara',
      ingredients: 'Spaghetti, Eggs, Pancetta, Parmesan, Pepper',
      content: 'A classic Roman pasta dish. Creamy, rich, and ready in 30 minutes.'
    },
    {
      title: 'Chicken Tikka Masala',
      ingredients: 'Chicken, Yogurt, Tomato Puree, Garam Masala, Cream',
      content: 'A popular Indian curry with grilled chicken in a spiced tomato sauce.'
    }
  ];

  // --- 2. Generate Embeddings and Format for Supabase ---
  const embedder = await EmbeddingPipeline.getInstance();

  for (const recipe of recipesToSeed) {
    const embeddingText = `Title: ${recipe.title}; Ingredients: ${recipe.ingredients}; Description: ${recipe.content}`;

    const output = await embedder(embeddingText, {
      pooling: 'mean',
      normalize: true,
    });
    
    const embedding = Array.from(output.data);

    // --- 3. Store in Supabase ---
    const { data, error } = await supabase
      .from('recipes_os')
      .insert({
        title: recipe.title,
        ingredients: recipe.ingredients,
        content: recipe.content,
        embedding: embedding,
      });

    if (error) {
      console.error('Error inserting recipe:', error);
    } else {
      console.log('Inserted recipe:', data);
    }
  }

  res.status(200).json({ message: 'Successfully seeded recipes with open-source model!' });
}
```

#### **Step B4: Implementing the Search API Route**

Example Next.js API route (`pages/api/search-recipes-os.js`):

```javascript
// pages/api/search-recipes-os.js
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@huggingface/transformers';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class EmbeddingPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // 1. Generate an embedding for the user's search query using the local model
  const embedder = await EmbeddingPipeline.getInstance();
  const output = await embedder(query, {
    pooling: 'mean',
    normalize: true,
  });
  const queryEmbedding = Array.from(output.data);

  // 2. Call the Supabase database function to find matching recipes
  const { data: recipes, error } = await supabase.rpc('match_recipes_os', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5,
  });

  if (error) {
    console.error('Error matching recipes:', error);
    return res.status(500).json({ error: 'Failed to find matching recipes' });
  }

  // 3. Return the matched recipes
  res.status(200).json(recipes);
}
```

#### **Step B5: Building the Frontend Search Page**

The `pages/search.js` component from Part A can be reused. You would only need to change the `fetch` URL to point to `/api/search-recipes-os` to use the open-source backend.

### Part C: Python Backend with Pydantic and Sentence-Transformers

This approach involves creating a dedicated Python service for AI tasks. Your Next.js app will then communicate with this service.

#### **Step C1: Python Backend Setup**

1.  **Create a Project Directory:**
    Create a new folder for your Python backend, separate from your Next.js app.

2.  **Install Python Libraries:**
    ```bash
    pip install fastapi uvicorn pydantic sentence-transformers supabase
    ```
    *   `fastapi`: A modern, fast web framework for building APIs.
    *   `uvicorn`: A server to run your FastAPI application.
    *   `pydantic`: For data validation.
    *   `sentence-transformers`: To generate the embeddings.
    *   `supabase`: The official Python client for Supabase.

3.  **Create a Basic FastAPI App:**
    Create a file named `main.py`. This will be the entry point for your Python service.
    ```python
    # main.py
    import os
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware # Added for CORS
    from pydantic import BaseModel, Field
    from sentence_transformers import SentenceTransformer
    from supabase import create_client, Client

    # --- Environment Variables (for Supabase) ---
    # In a real project, you'd use environment variables or a .env file for these
    # For now, placeholder - ensure these are set in your deployment environment
    SUPABASE_URL = os.environ.get("YOUR_SUPABASE_PROJECT_URL")
    SUPABASE_KEY = os.environ.get("YOUR_SUPABASE_SERVICE_ROLE_KEY")

    # --- Initialize Clients ---
    app = FastAPI(
        title="Smart Food & Recipe AI Service",
        description="A service for handling AI-powered recipe tasks.",
    )
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    model = SentenceTransformer('all-MiniLM-L6-v2') # Load the model once

    # --- CORS Middleware ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"], # Replace with your Next.js app's URL in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Pydantic Models for Data Validation ---
    class Recipe(BaseModel):
        title: str
        ingredients: str
        content: str

    class SeedResponse(BaseModel):
        message: str
        inserted_count: int

    class SearchQuery(BaseModel):
        query: str
        match_threshold: float = 0.7
        match_count: int = 5

    class RecipeResult(BaseModel):
        id: int
        title: str
        ingredients: str
        content: str
        similarity: float

    # --- API Endpoint to Seed Data ---
    @app.post("/seed-recipes", response_model=SeedResponse)
    def seed_recipes_endpoint():
        recipes_to_seed = [
            {
                "title": "Spaghetti Carbonara",
                "ingredients": "Spaghetti, Eggs, Pancetta, Parmesan, Pepper",
                "content": "A classic Roman pasta dish. Creamy, rich, and ready in 30 minutes."
            },
            {
                "title": "Chicken Tikka Masala",
                "ingredients": "Chicken, Yogurt, Tomato Puree, Garam Masala, Cream",
                "content": "A popular Indian curry with grilled chicken in a spiced tomato sauce."
            }
        ]

        inserted_count = 0
        for recipe_data in recipes_to_seed:
            recipe = Recipe(**recipe_data)

            embedding_text = f"Title: {recipe.title}; Ingredients: {recipe.ingredients}; Description: {recipe.content}"
            
            embedding = model.encode(embedding_text).tolist()

            data, count = supabase.table('recipes_os').insert({
                "title": recipe.title,
                "ingredients": recipe.ingredients,
                "content": recipe.content,
                "embedding": embedding
            }).execute()
            
            inserted_count += 1

        return {"message": "Successfully seeded recipes!", "inserted_count": inserted_count}

    # --- API Endpoint for Search ---
    @app.post("/search", response_model=list[RecipeResult])
    def search_recipes_endpoint(search_query: SearchQuery):
        query_embedding = model.encode(search_query.query).tolist()

        results = supabase.rpc('match_recipes_os', {
            'query_embedding': query_embedding,
            'match_threshold': search_query.match_threshold,
            'match_count': search_query.match_count
        }).execute()

        # The data from rpc call is in results.data
        if results.data:
            # Pydantic validates each item in the list automatically
            return [RecipeResult(**item) for item in results.data]
        return []

    # --- Root Endpoint ---
    @app.get("/")
    def read_root():
        return {"status": "AI Service is running"}
```

#### **Step C2: Database Preparation**

This step is identical to the one in Part B. You would use the same Supabase table (`recipes_os`) and the same PostgreSQL function (`match_recipes_os`) that are designed for a `384`-dimension vector. No changes are needed in your database if you've already set it up for Part B.

#### **Step C3: Generating and Storing Embeddings in Python**

(See code additions above under `main.py`)

#### **Step C4: Implementing the Search API Endpoint in Python**

(See code additions above under `main.py`)

#### **Step C5: Connecting the Next.js Frontend**

1.  **Update the Frontend Fetch Call:**
    In your `pages/search.js` file, you would change the `fetch` URL to point to your running Python service.
    ```javascript
    // In the handleSearch function of pages/search.js
    const response = await fetch('http://127.0.0.1:8000/search', { // <-- URL of your Python service
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          query: query,
          match_threshold: 0.7,
          match_count: 5 
      }),
    });
    ```

2.  **Handling CORS (Cross-Origin Resource Sharing):**
    As shown in the `main.py` code, you need to configure CORS in your FastAPI application to allow requests from your Next.js frontend.

---

## 4. Conclusion and Recommendation

We have explored three distinct paths for implementing semantic search in your "Smart Food & Recipe Platform":

1.  **OpenAI Integration (Part A):** Offers ease of use and high-quality embeddings via an API. However, it is a paid service beyond initial free credits, which conflicts with your "free tier only" constraint for long-term use.
2.  **Open-Source Integration with `transformers.js` and `pgvector` (Part B):** Provides a truly free solution by hosting the embedding model yourself directly within your Next.js application. This requires more initial setup and management but offers full control and aligns perfectly with your budget constraint.
3.  **Python Backend with Pydantic and Sentence-Transformers (Part C):** This approach leverages the powerful Python AI/ML ecosystem, using `sentence-transformers` for embeddings and Pydantic for robust data validation within a FastAPI service. While Pydantic itself is free, this method introduces the overhead of managing a separate Python backend service, including its hosting costs (even if on a free tier).

**Trade-offs Summary:**

| Feature                 | OpenAI (Part A)             | Open-Source (Part B)            | Python Backend (Part C)               |
| :---------------------- | :-------------------------- | :------------------------------ | :------------------------------------ |
| **Cost**                | Paid (after free credits)   | Free (self-hosted JS)           | Free for libraries (needs hosting)    |
| **Ease of Setup**       | High (API calls)            | Medium (JS model integration)   | Medium-High (separate Python service) |
| **Performance**         | Excellent                   | Good                            | Good (FastAPI is performant)          |
| **Control**             | Low                         | High                            | High                                  |
| **Maintenance**         | Low                         | Medium                          | Medium-High                           |
| **Free Tier Constraint**| No (long-term)              | Yes (long-term)                 | Yes, but with added hosting complexity|

**Recommendation:**

Considering your strict **"all services used, including AI, must be on a free tier"** constraint, the **Open-Source Integration with `transformers.js` and `pgvector` (Part B) remains the most straightforward and fully free recommendation.** It keeps your stack entirely JavaScript-based and avoids additional hosting costs associated with a separate Python backend.

If you specifically require Python's larger ecosystem for other AI model types (beyond just embeddings) or prefer Python for backend logic, then **Part C (Python Backend)** becomes a viable option. However, be mindful of the added operational complexity and potential for separate hosting costs beyond the base free tier of your primary Next.js/Supabase deployment.

This completes the detailed technical research report. Please review it, and let me know if you have any questions or if you'd like to proceed with a specific implementation path.
