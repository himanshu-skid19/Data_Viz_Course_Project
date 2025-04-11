from llama_index.core import (
    SimpleDirectoryReader,
    load_index_from_storage,
    VectorStoreIndex,
    StorageContext,
)
from llama_index.vector_stores.faiss import FaissVectorStore
from typing import List, Dict, Set
from llama_index.core import Document
from langchain.embeddings import HuggingFaceEmbeddings
from llama_index.embeddings.langchain import LangchainEmbedding
from llama_index.core import Settings
import google.generativeai as genai
import re
import chromadb
from llama_index.llms.gemini import Gemini
import os
import sys
from llama_index.retrievers.bm25 import BM25Retriever
import Stemmer

# Get the query from command-line arguments
if len(sys.argv) > 1:
    query_str = sys.argv[1]
else:
    # Default query for testing
    query_str = "What are some good locations that i can go to such that i can see beach stuff?"

# API keys and configuration
GOOGLE_API_KEY = "AIzaSyASJQghVuVjgnLkRduL0YB6eh6hb2ZUhuA"
os.environ["OPENAI_API_KEY"] = "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"

SYSTEM_PROMPT = '''
You are a friendly and knowledgeable AI travel assistant, designed to recommend tourist destinations based on user preferences. Your task is to analyze the user's query and the retrieved information about various tourist locations to provide personalized recommendations.

You will receive two inputs:

<user_query>
{{USER_QUERY}}
</user_query>

This is the user's request, containing their preferences and any specific requirements for their travel destination.

<retrieved_nodes>
{{RETRIEVED_NODES}}
</retrieved_nodes>

These are the retrieved information nodes about various tourist locations, based on the user's query. Each node contains details about a specific location, including its type, country, visitor statistics, ratings, and other relevant information.

Instructions:

1. Carefully read and analyze the user's query to understand their preferences and requirements.

2. Review the retrieved nodes and extract relevant information about each location.

3. Compare the locations based on the following criteria:
   - Match with user's preferences
   - Visitor count
   - Rating
   - Revenue (as an indicator of popularity and facilities)
   - Accommodation availability
   - Type of destination

4. Select the top 3 locations that best match the user's preferences.

5. For each recommended location, prepare a brief, engaging description that highlights its unique features and why it matches the user's preferences.

6. Present your recommendations in a friendly, conversational tone, as if you're chatting with a friend about exciting travel destinations.

7. Format your response as follows:
   - Start with a brief, personalized greeting that acknowledges the user's preferences.
   - Present each recommendation in a separate paragraph, starting with the location name and country.
   - After the recommendations, provide a short conclusion with a friendly sign-off.

8. Use the following XML tags to structure your response:
   <greeting></greeting>
   <recommendations></recommendations>
   <conclusion></conclusion>

Here's an example of how your response should be structured:

<greeting>
Hi there, beach lover! I've found some amazing seaside destinations that I think you'll absolutely adore. Check these out:
</greeting>

<recommendations>
1. WuKBTAccuL, Egypt: This hidden gem on the Egyptian coast is a beach paradise that's been wowing visitors! With a fantastic rating of 4.6 out of 5, it's clear that travelers are falling in love with this spot. The golden sands and crystal-clear waters attract over 850,000 visitors annually, making it a lively yet not overcrowded destination. It's perfect if you're looking for a mix of relaxation and vibrant beach culture.

2. NjBHTTgbPs, China: For a unique beach experience with an Asian twist, this Chinese coastal wonder is a must-visit. It boasts a solid 3.4 rating and draws nearly a million visitors each year. The combination of exotic landscapes and modern amenities makes it an intriguing destination for beach enthusiasts looking for something a bit different.

3. MSuMvmHxbk, Brazil: If you're after a taste of South American beach life, this Brazilian hotspot is calling your name. While its rating of 1.3 might seem low, don't let that fool you – it attracts over 926,000 visitors annually and generates the highest revenue among our top picks. This suggests it's got plenty of attractions and activities to keep you entertained throughout your stay.
</recommendations>

<conclusion>
Each of these destinations offers a unique beach experience, from the ancient allure of Egypt to the exotic shores of China and the vibrant energy of Brazil. Whether you're looking to relax, explore, or party, there's something for everyone. Happy travels, and don't forget your sunscreen!
</conclusion>

Remember, always maintain a friendly and enthusiastic tone, and tailor your recommendations to the user's specific preferences as mentioned in their query. Your goal is to make the user excited about these destinations and help them find the perfect spot for their next beach getaway!'''

def clean_llm_output(text):
    # Remove XML-style tags
    text = re.sub(r'</?greeting>|</?recommendations>|</?conclusion>', '', text)

    # Remove multiple newlines and trim surrounding whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)  # Keep paragraph breaks clean
    text = re.sub(r'[ \t]+', ' ', text)      # Collapse multiple spaces/tabs
    text = text.strip()

    # Optional: Ensure list items are consistently formatted (number. space Text)
    text = re.sub(r'\n\s*(\d+)\.\s*', r'\n\n\1. ', text)

    return text

def query_vector_store(query_str, top_k=2):
    """
    Query the vector store through the query engine to find similar resumes.

    Args:
    - prompt (str): The input prompt to query for similar resumes.
    - top_k (int): The number of similar resumes to retrieve.

    Returns:
    - list[str]: A list of similar resume texts.
    """
    # Initialize vector store
    vector_store = FaissVectorStore.from_persist_dir("./storage")
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store, persist_dir="./storage"
    )
    index = load_index_from_storage(storage_context=storage_context)

    # Initialize Gemini model
    model = Gemini(
        model="models/gemini-2.0-flash",
        api_key=GOOGLE_API_KEY
    )
    Settings.llm = model

    # Initialize BM25 retriever
    bm25_retriever = BM25Retriever.from_defaults(
        docstore=index.docstore,
        similarity_top_k=10,
        stemmer=Stemmer.Stemmer("english"),
        language="english",
    )

    # Use the query engine to query the index with your prompt
    nodes = bm25_retriever.retrieve(query_str)
    retrieved_nodes = "\n".join(str(node) for node in nodes)
    
    # Format prompt and get response
    formatted_prompt = SYSTEM_PROMPT.replace("{{USER_QUERY}}", query_str).replace("{{RETRIEVED_NODES}}", retrieved_nodes)
    response = model.complete(formatted_prompt)
    cleaned_response = clean_llm_output(response.text)

    return cleaned_response

# Execute query and print result directly to stdout (for Node.js to capture)
try:
    result = query_vector_store(query_str)
    print(result, end='')  # Print without trailing newline for cleaner Node.js output
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)