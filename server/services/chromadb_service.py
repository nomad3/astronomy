"""ChromaDB service for vector embeddings and semantic search."""

from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings

from core.config import settings


# Initialize ChromaDB client
# Using persistent storage in a local directory
_client: Optional[chromadb.PersistentClient] = None


def get_chromadb_client() -> chromadb.PersistentClient:
    """Get or create ChromaDB client."""
    global _client
    if _client is None:
        # Use persistent local storage with newer API
        _client = chromadb.PersistentClient(
            path="./chromadb_data",
            settings=ChromaSettings(
                anonymized_telemetry=False,
            )
        )
    return _client


def get_collection(name: str = "space_news"):
    """Get or create a collection."""
    client = get_chromadb_client()
    return client.get_or_create_collection(
        name=name,
        metadata={"description": "Space news and discoveries for pattern analysis"}
    )


async def add_documents(
    documents: List[str],
    metadatas: List[Dict[str, Any]],
    ids: List[str],
    collection_name: str = "space_news"
) -> None:
    """Add documents to the collection with embeddings."""
    collection = get_collection(collection_name)

    # ChromaDB will generate embeddings automatically using its default model
    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids,
    )


async def query_similar(
    query_text: str,
    n_results: int = 10,
    collection_name: str = "space_news",
    where_filter: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Query for similar documents."""
    collection = get_collection(collection_name)

    results = collection.query(
        query_texts=[query_text],
        n_results=n_results,
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    return {
        "ids": results["ids"][0] if results["ids"] else [],
        "documents": results["documents"][0] if results["documents"] else [],
        "metadatas": results["metadatas"][0] if results["metadatas"] else [],
        "distances": results["distances"][0] if results["distances"] else [],
    }


async def get_all_documents(
    collection_name: str = "space_news",
    limit: int = 100,
) -> Dict[str, Any]:
    """Get all documents from collection."""
    collection = get_collection(collection_name)

    results = collection.get(
        limit=limit,
        include=["documents", "metadatas"],
    )

    return {
        "ids": results["ids"],
        "documents": results["documents"],
        "metadatas": results["metadatas"],
    }


async def delete_documents(
    ids: List[str],
    collection_name: str = "space_news",
) -> None:
    """Delete documents by ID."""
    collection = get_collection(collection_name)
    collection.delete(ids=ids)


async def get_collection_stats(collection_name: str = "space_news") -> Dict[str, Any]:
    """Get collection statistics."""
    collection = get_collection(collection_name)
    return {
        "name": collection_name,
        "count": collection.count(),
    }
