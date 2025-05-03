import json
import os
from pathlib import Path
from typing import List, Dict, Any
from llama_index.core import Document

def export_documents_to_file(documents: List[Document], output_file: str = "tourism_documents.jsonl") -> str:
    """
    Export LlamaIndex documents to a text file in JSONL format
    
    Args:
        documents: List of LlamaIndex documents
        output_file: Path to the output file
        
    Returns:
        Path to the saved file
    """
    output_path = Path(output_file)
    
    # Create directory if it doesn't exist
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write documents to file in JSONL format
    with open(output_path, 'w', encoding='utf-8') as f:
        for doc in documents:
            # Convert document to dict
            doc_dict = {
                'text': doc.text,
                'metadata': doc.metadata,
                'id': doc.id_
            }
            
            # Write as JSON line
            f.write(json.dumps(doc_dict) + '\n')
    
    print(f"Exported {len(documents)} documents to {output_path}")
    return str(output_path)

def import_documents_from_file(input_file: str = "tourism_documents.jsonl") -> List[Document]:
    """
    Import LlamaIndex documents from a text file in JSONL format
    
    Args:
        input_file: Path to the input file
        
    Returns:
        List of LlamaIndex documents
    """
    input_path = Path(input_file)
    
    # Check if file exists
    if not input_path.exists():
        print(f"Error: File {input_path} does not exist")
        return []
    
    documents = []
    
    # Read documents from file
    with open(input_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                # Parse JSON line
                doc_dict = json.loads(line.strip())
                
                # Create LlamaIndex document
                doc = Document(
                    text=doc_dict['text'],
                    metadata=doc_dict.get('metadata', {}),
                    id_=doc_dict.get('id')
                )
                
                documents.append(doc)
            except json.JSONDecodeError:
                print(f"Error: Could not decode JSON line: {line}")
                continue
    
    print(f"Imported {len(documents)} documents from {input_path}")
    return documents

def export_tourism_documents(documents: List[Document], 
                           base_output_path: str = "tourism_data", 
                           organize_by_type: bool = True) -> Dict[str, str]:
    """
    Export tourism documents to text files, optionally organizing by document type
    
    Args:
        documents: List of LlamaIndex documents
        base_output_path: Base directory for output files
        organize_by_type: Whether to organize documents by type in separate files
        
    Returns:
        Dictionary mapping document types to file paths
    """
    base_path = Path(base_output_path)
    base_path.mkdir(parents=True, exist_ok=True)
    
    output_files = {}
    
    if organize_by_type:
        # Group documents by type
        doc_types = {}
        for doc in documents:
            doc_type = doc.metadata.get('doc_type', 'unknown')
            if doc_type not in doc_types:
                doc_types[doc_type] = []
            doc_types[doc_type].append(doc)
        
        # Export each document type to a separate file
        for doc_type, docs in doc_types.items():
            filename = f"{doc_type}_documents.jsonl"
            file_path = base_path / filename
            export_documents_to_file(docs, str(file_path))
            output_files[doc_type] = str(file_path)
    else:
        # Export all documents to a single file
        file_path = base_path / "all_documents.jsonl"
        export_documents_to_file(documents, str(file_path))
        output_files['all'] = str(file_path)
    
    # Create a summary file with document counts
    summary = {
        'total_documents': len(documents),
        'document_types': {doc_type: len(docs) for doc_type, docs in doc_types.items()} if organize_by_type else {},
        'output_files': output_files
    }
    
    with open(base_path / 'document_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    return output_files

def export_documents_as_text(documents: List[Document], output_file: str = "tourism_documents.txt") -> str:
    """
    Export documents to a human-readable text file
    
    Args:
        documents: List of LlamaIndex documents
        output_file: Path to the output file
        
    Returns:
        Path to the saved file
    """
    output_path = Path(output_file)
    
    # Create directory if it doesn't exist
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for i, doc in enumerate(documents, 1):
            f.write(f"=== DOCUMENT {i} ===\n")
            f.write(f"ID: {doc.id_}\n")
            f.write("METADATA:\n")
            for key, value in doc.metadata.items():
                f.write(f"  {key}: {value}\n")
            f.write("CONTENT:\n")
            f.write(doc.text)
            f.write("\n\n" + "="*50 + "\n\n")
    
    print(f"Exported {len(documents)} documents as readable text to {output_path}")
    return str(output_path)

# Example usage
if __name__ == "__main__":
    # This is just an example - in practice, you'd import these functions
    # and use them with your actual documents
    
    # Sample usage with mock documents
    sample_docs = [
        Document(
            text="This is a sample document about the Taj Mahal.",
            metadata={"doc_type": "monument", "location": "Taj Mahal"}
        ),
        Document(
            text="This is a sample document about tourism in Rajasthan.",
            metadata={"doc_type": "state_profile", "location": "Rajasthan"}
        )
    ]
    
    # Export to JSONL and readable text
    jsonl_path = export_documents_to_file(sample_docs, "sample_docs.jsonl")
    text_path = export_documents_as_text(sample_docs, "sample_docs.txt")
    
    # Import from JSONL
    imported_docs = import_documents_from_file(jsonl_path)
    
    print(f"Imported {len(imported_docs)} documents")