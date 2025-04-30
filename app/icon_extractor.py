import ctypes
from ctypes import wintypes
from PIL import Image
import io

def extract_icon_as_blob(icon_path, size=32):
    try:
        print(icon_path)
        # Load icon from file
        hicon = ctypes.windll.shell32.ExtractIconW(0, icon_path, 0)
        if hicon == 0:
            raise Exception(f"Could not extract icon from: {icon_path}")

        # Prepare for drawing
        hdc = ctypes.windll.user32.GetDC(0)
        hdc_mem = ctypes.windll.gdi32.CreateCompatibleDC(hdc)
        hbitmap = ctypes.windll.gdi32.CreateCompatibleBitmap(hdc, size, size)
        ctypes.windll.gdi32.SelectObject(hdc_mem, hbitmap)

        # Draw icon
        ctypes.windll.user32.DrawIconEx(hdc_mem, 0, 0, hicon, size, size, 0, 0, 3)

        # Bitmap info
        class BITMAPINFOHEADER(ctypes.Structure):
            _fields_ = [
                ('biSize', wintypes.DWORD),
                ('biWidth', wintypes.LONG),
                ('biHeight', wintypes.LONG),
                ('biPlanes', wintypes.WORD),
                ('biBitCount', wintypes.WORD),
                ('biCompression', wintypes.DWORD),
                ('biSizeImage', wintypes.DWORD),
                ('biXPelsPerMeter', wintypes.LONG),
                ('biYPelsPerMeter', wintypes.LONG),
                ('biClrUsed', wintypes.DWORD),
                ('biClrImportant', wintypes.DWORD),
            ]

        class BITMAPINFO(ctypes.Structure):
            _fields_ = [
                ('bmiHeader', BITMAPINFOHEADER),
                ('bmiColors', ctypes.c_uint32 * 3)
            ]

        bmi = BITMAPINFO()
        bmi.bmiHeader.biSize = ctypes.sizeof(BITMAPINFOHEADER)
        bmi.bmiHeader.biWidth = size
        bmi.bmiHeader.biHeight = -size  # top-down
        bmi.bmiHeader.biPlanes = 1
        bmi.bmiHeader.biBitCount = 32
        bmi.bmiHeader.biCompression = 0  # BI_RGB

        buffer = ctypes.create_string_buffer(size * size * 4)
        ctypes.windll.gdi32.GetDIBits(hdc_mem, hbitmap, 0, size, buffer, ctypes.byref(bmi), 0)

        # Create image from buffer
        image = Image.frombuffer('RGBA', (size, size), buffer, 'raw', 'BGRA', 0, 1)

        # Convert image to binary blob (in memory)
        output = io.BytesIO()
        image.save(output, format='PNG')
        blob_data = output.getvalue()

        # Cleanup
        ctypes.windll.user32.DestroyIcon(hicon)
        ctypes.windll.gdi32.DeleteObject(hbitmap)
        ctypes.windll.gdi32.DeleteDC(hdc_mem)
        ctypes.windll.user32.ReleaseDC(0, hdc)

        return blob_data
    except Exception as e:
        print(f"An error occurred: {e}")