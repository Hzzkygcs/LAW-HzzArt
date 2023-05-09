from __future__ import annotations
import aiohttp
import requests
from CraiyonService.templates import GeneratedImagesV1

# V1 version of Craiyon API, for backwards compatibility
class Craiyon:
    '''
    **NOTICE**: This is the V1 version of Craiyon's model. To use the updated V2 model, use the normal `Craiyon` class instead.
    
    Instantiates a Craiyon session, allows user to generate images from text prompts.
    The model takes some time to generate the images (roughly around 1 minute).
    So be patient, and don't abuse the api, as I am not the one hosting the model, craiyon itself is.
    '''
    
    
    def __init__(self) -> None:
        self.BASE_URL = "https://backend.craiyon.com"
        self.DRAW_API_ENDPOINT = "/generate"
    
    def generate(self, prompt: str) -> GeneratedImagesV1:
        
        """
        Generates 9 images using the V1 model of Craiyon.
        
        Arguments:
        - (Required) | Prompt: The text prompt that will be used to generate the images
        
        Returns:
        - Returns a list of 9 Base64 bytestrings (.jpg)
        """
        
        session = requests.Session()
        url = self.BASE_URL + self.DRAW_API_ENDPOINT
        resp = session.post(url, json={'prompt': prompt})
        return GeneratedImagesV1(resp.json()['images'])

    async def async_generate(self, prompt: str) -> GeneratedImagesV1:
        
        """
        Generates 9 images asynchronously using the V1 model of Craiyon.
        
        Arguments:
        - (Required) | Prompt: The text prompt that will be used to generate the images
        
        Returns:
        - Returns a list of 9 Base64 bytestrings (.jpg)
        """
        
        url = self.BASE_URL + self.DRAW_API_ENDPOINT
        async with aiohttp.ClientSession() as sess:
            async with sess.post(url, json={"prompt": prompt}) as resp:
                resp = await resp.json()
                return GeneratedImagesV1(resp['images'])