from ArtGenerator import ArtGenerator
import token_storage
import string, random

async def generate_async(prompt, token) -> None:
    generator = ArtGenerator()
    await generator.generate_image(prompt)
    
    token_storage.store(token, generator.get_images())

def generate_token() -> str:
    letters = string.ascii_letters + string.digits
    token = ''.join(random.choice(letters) for _ in range(15))
    return token