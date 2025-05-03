import json
import re
import uuid
from pathlib import Path
from typing import List, Dict, Any
from llama_index.core import Document

def extract_attraction_name_from_url(url: str) -> str:
    """Extract the attraction name from TripAdvisor URL."""
    # Regular expression to match attraction name from URL pattern
    match = re.search(r'AttractionProductDetail-[^-]+-[^-]+-([^-]+)-', url)
    if match:
        # Replace underscores with spaces and capitalize words
        name = match.group(1).replace('_', ' ').title()
        return name
    return "Unknown Attraction"

def extract_location_from_url(url: str) -> Dict[str, str]:
    """Extract location information from TripAdvisor URL."""
    location = {"country": "", "province": "", "city": ""}
    
    # Pattern: .html","category":"featured_tours_and_tickets"},{"attraction":"https:\/\/tripadvisor.ca\/AttractionProductDetail-g154943-d11450219-Vancouver_City_Sightseeing_Tour-Vancouver_British_Columbia
    match = re.search(r'-([^-]+)_([^_]+)(?:_([^\.]+))?\.html', url)
    if match:
        location_parts = match.group(0).split('-')
        if len(location_parts) >= 2:
            # Last part often contains City_Province format
            city_province = location_parts[-1].replace('.html', '').split('_')
            if len(city_province) >= 2:
                location["city"] = city_province[0].replace('_', ' ').title()
                location["province"] = ' '.join(city_province[1:]).replace('_', ' ').title()
                
    return location

def create_attraction_document(category_data: Dict[str, Any], details_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Create a document for a vector store from attraction data.
    
    Args:
        category_data: Dictionary with attraction URL and category
        details_data: Dictionary with detailed attraction information (optional)
        
    Returns:
        A dictionary representing a document for the vector store
    """
    # Generate a unique ID for the document
    doc_id = str(uuid.uuid4())
    
    # Extract information from category data
    attraction_url = category_data.get("attraction", "")
    category = category_data.get("category", "Unknown")
    
    # Extract name from URL if details are not available
    attraction_name = extract_attraction_name_from_url(attraction_url)
    location_info = extract_location_from_url(attraction_url)
    
    # Initialize metadata
    metadata = {
        "doc_type": "attraction",
        "url": attraction_url,
        "category": category,
        "name": attraction_name
    }
    
    # Initialize text content
    text = f"Type: Tourist Attraction\n"
    text += f"Name: {attraction_name}\n"
    text += f"Category: {category.replace('_', ' ').title()}\n"
    
    # Add details if available
    if details_data:
        # Update with details data
        attraction_name = details_data.get("name", "").replace('_', ' ').title()
        metadata["name"] = attraction_name
        metadata["attraction_id"] = details_data.get("attraction_id")
        metadata["country"] = details_data.get("country", "")
        metadata["province"] = details_data.get("province", "")
        metadata["city"] = details_data.get("city", "")
        
        # Check if location is a dictionary before using .get()
        if "location" in details_data:
            location_data = details_data["location"]
            if isinstance(location_data, dict):
                metadata["latitude"] = location_data.get("lat")
                metadata["longitude"] = location_data.get("lng")
            else:
                # Handle case where location is a string
                metadata["location_str"] = location_data
        
        metadata["price"] = details_data.get("price")
        metadata["rating"] = details_data.get("rating")
        
        # Update text content with details
        text = f"Type: Tourist Attraction\n"
        text += f"Name: {attraction_name}\n"
        text += f"Location: {details_data.get('city', '').title()}, {details_data.get('province', '').title()}, {details_data.get('country', '').title()}\n"
        text += f"Category: {category.replace('_', ' ').title()}\n"
        
        if "price" in details_data:
            text += f"Price: ${details_data['price']:.2f}\n"
        
        if "rating" in details_data:
            text += f"Rating: {details_data['rating']}/5.0\n"
            
        if "location" in details_data:
            location_data = details_data["location"]
            if isinstance(location_data, dict):
                text += f"Coordinates: {location_data.get('lat')}, {location_data.get('lng')}\n"
            else:
                text += f"Location: {location_data}\n"
    else:
        # Use extracted location if details not available
        if location_info["city"]:
            text += f"Location: {location_info['city']}, {location_info['province']}\n"
            metadata.update(location_info)
    
    # Add URL to text
    text += f"URL: {attraction_url}\n"
    
    return {
        "text": text,
        "metadata": metadata,
        "id": doc_id
    }

def load_json_file(file_path: str) -> List[Dict[str, Any]]:
    """Load data from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading {file_path}: {e}")
        return []

def match_attractions(categories: List[Dict[str, Any]], details: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Match attractions from categories with their details based on name similarity."""
    # Create a dictionary of details by name (normalized)
    details_by_name = {}
    for detail in details:
        name = detail.get("name", "").lower()
        if name:
            details_by_name[name] = detail
    
    # Match each category with its detail
    matched = {}
    for category in categories:
        url = category.get("attraction", "")
        # Extract name from URL
        name_from_url = extract_attraction_name_from_url(url).lower().replace(' ', '_')
        
        # Look for matching detail
        if name_from_url in details_by_name:
            matched[url] = {
                "category": category,
                "details": details_by_name[name_from_url]
            }
        else:
            # No match found, just store category
            matched[url] = {
                "category": category,
                "details": None
            }
    
    return matched

def create_documents_from_attraction_data(
    categories_file: str, 
    details_file: str, 
    output_file: str = "attraction_documents.jsonl"
) -> List[Document]:
    """
    Create vector store documents from attraction data files.
    
    Args:
        categories_file: Path to the categories JSON file
        details_file: Path to the details JSON file
        output_file: Path to save the output JSONL file
        
    Returns:
        List of LlamaIndex documents
    """
    # Load data from JSON files
    categories = load_json_file(categories_file)
    details = load_json_file(details_file)
    
    print(f"Loaded {len(categories)} attractions from {categories_file}")
    print(f"Loaded {len(details)} attraction details from {details_file}")
    
    # Match attractions with their details
    matched_attractions = match_attractions(categories, details)
    print(f"Matched {len(matched_attractions)} attractions with their details")
    
    documents = []
    
    # Process each attraction and create documents
    with open(output_file, 'w', encoding='utf-8') as f:
        for _, attraction_data in matched_attractions.items():
            category_data = attraction_data["category"]
            details_data = attraction_data["details"]
            
            # Create document
            doc_dict = create_attraction_document(category_data, details_data)
            
            # Write to JSONL file
            f.write(json.dumps(doc_dict) + '\n')
            
            # Create LlamaIndex document
            doc = Document(
                text=doc_dict['text'],
                metadata=doc_dict['metadata'],
                id_=doc_dict['id']
            )
            
            documents.append(doc)
    
    print(f"Created {len(documents)} documents and saved to {output_file}")
    return documents

def main():
    # Example usage
    documents = create_documents_from_attraction_data(
        "attractions_cat.json",
        "attractions_details_batch1.json"
    )
    
    # Print sample document
    if documents:
        print("\nSample document:")
        print(f"ID: {documents[0].id_}")
        print(f"Text:\n{documents[0].text}")
        print(f"Metadata: {documents[0].metadata}")

if __name__ == "__main__":
    main()