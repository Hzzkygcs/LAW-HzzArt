from craiyon import CraiyonV1, craiyon_utils
from io import BytesIO
import base64

class ArtGenerator:
    def __init__(self) -> None:
        self.generator = CraiyonV1()
        self.images = []
        
    def get_images(self) -> list:
        return self.images
    
    def generate_image(self, prompt) -> None:
        self.result = self.generator.generate(prompt)
        self.images = craiyon_utils.encode_base64(self.result.images)
        
    def decode(self, images) -> list:
        result = []
        for image in images:
            result.append(BytesIO(base64.decodebytes(image)))
        return result