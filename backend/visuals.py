"""
Chronos Paradox — Visual Generation Service

Uses Google's Imagen 3 model (via Vertex AI) to generate
high-fidelity visualizations of the current temporal era.
"""

import os
import base64
import json

try:
    from google import genai
    from google.genai import types
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class ImageGenerator:
    """
    Handles image generation requests using Imagen 3.
    """

    def __init__(self) -> None:
        self.client = None
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        
        if GEMINI_AVAILABLE and api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception:
                self.client = None

    def generate_scene(self, prompt: str, era: str) -> dict:
        """
        Generate a scene image using Imagen 3.
        Returns JSON with image data (base64) or error.
        """
        if not self.client:
            return {
                "success": False, 
                "error": "Imagen 3 not available (no credentials or SDK)",
                "fallback_color": self._get_fallback_color(era)
            }

        # Enhanced prompt for better style
        style_guide = "cinematic lighting, highly detailed, atmospheric, 8k resolution, concept art style"
        full_prompt = f"{prompt}, set in {era} era. {style_guide}"

        try:
            # Call Imagen 3 model
            response = self.client.models.generate_images(
                model='imagen-3.0-generate-001',
                prompt=full_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="16:9",
                    safety_filter_level="block_medium_and_above",
                    person_generation="allow_adult"
                )
            )

            # Extract image
            if response.generated_images:
                image = response.generated_images[0]
                return {
                    "success": True,
                    "image_base64": base64.b64encode(image.image.image_bytes).decode('utf-8'),
                    "prompt_used": full_prompt
                }
            
            return {"success": False, "error": "No image generated"}

        except Exception as e:
            print(f"Imagen Error: {e}")
            return {
                "success": False, 
                "error": str(e),
                "fallback_color": self._get_fallback_color(era)
            }

    def _get_fallback_color(self, era: str) -> str:
        """Return a thematic color for fallback background."""
        colors = {
            "Dark Ages": "#2a1a1a",
            "Medieval": "#3a2a1a",
            "Renaissance": "#4a3a1a",
            "Enlightenment": "#2a3a4a",
            "Industrial": "#1a1a1a",
            "Digital": "#0a1a2a",
            "Neo Age": "#0a2a3a",
            "Cyberpunk": "#2a0a2a"
        }
        return colors.get(era, "#000000")
