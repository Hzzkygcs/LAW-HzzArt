from ArtGenerator import ArtGenerator
import token_storage
import string, random

def generate_sync(prompt, token) -> None:
    generator = ArtGenerator()
    generator.generate_image(prompt)
    
    print("Udah Selesai Generate")
    token_storage.store(token, generator.get_images())

def generate_token() -> str:
    letters = string.ascii_letters + string.digits
    token = ''.join(random.choice(letters) for _ in range(25))
    return token