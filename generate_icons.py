from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # Create image with blue background
    img = Image.new('RGB', (size, size), color='#0ea5e9')
    draw = ImageDraw.Draw(img)
    
    # Draw a stylized checkmark
    # Coordinates for a checkmark: start, dip, end
    start_point = (size * 0.25, size * 0.5)
    dip_point = (size * 0.45, size * 0.7)
    end_point = (size * 0.75, size * 0.3)
    
    line_width = int(size * 0.1)
    
    draw.line([start_point, dip_point, end_point], fill='white', width=line_width, joint='curve')
    
    img.save(f'public/icons/icon-{size}x{size}.png')

create_icon(192)
create_icon(512)
