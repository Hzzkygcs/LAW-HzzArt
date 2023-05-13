from CraiyonService.craiyon import Craiyon
import CraiyonService.craiyon_utils as craiyon_utils
from io import BytesIO
import base64

class ArtGenerator:
    def __init__(self) -> None:
        self.generator = Craiyon()
        self.images = []
        
    def get_images(self) -> list:
        return self.images
    
    async def generate_image(self, prompt) -> None:
        self.result = await self.generator.async_generate(prompt)
        self.images = craiyon_utils.encode_base64(self.result.images)
        
    def decode(self, images) -> list:
        result = []
        for image in images:
            result.append(BytesIO(base64.decodebytes(image)))
        return result