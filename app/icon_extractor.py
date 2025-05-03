import ctypes
from ctypes import wintypes
from PIL import Image
import io

def extract_associated_icon_as_blob(file_path, size=32):
    try:
        # Constants
        SHGFI_ICON = 0x000000100
        SHGFI_LARGEICON = 0x000000000  # 32x32
        SHGFI_SMALLICON = 0x000000001  # 16x16

        class SHFILEINFO(ctypes.Structure):
            _fields_ = [
                ("hIcon", wintypes.HICON),
                ("iIcon", wintypes.INT),
                ("dwAttributes", wintypes.DWORD),
                ("szDisplayName", wintypes.WCHAR * 260),
                ("szTypeName", wintypes.WCHAR * 80)
            ]

        shfi = SHFILEINFO()

        flags = SHGFI_ICON | (SHGFI_SMALLICON if size <= 16 else SHGFI_LARGEICON)

        result = ctypes.windll.shell32.SHGetFileInfoW(
            file_path,
            0,
            ctypes.byref(shfi),
            ctypes.sizeof(shfi),
            flags
        )

        if result == 0:
            raise Exception(f"Could not get icon for: {file_path}")

        hicon = shfi.hIcon

        # Prepare to draw the icon
        hdc = ctypes.windll.user32.GetDC(0)
        hdc_mem = ctypes.windll.gdi32.CreateCompatibleDC(hdc)
        hbitmap = ctypes.windll.gdi32.CreateCompatibleBitmap(hdc, size, size)
        ctypes.windll.gdi32.SelectObject(hdc_mem, hbitmap)

        ctypes.windll.user32.DrawIconEx(hdc_mem, 0, 0, hicon, size, size, 0, 0, 3)

        # Get raw bitmap bits
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

        image = Image.frombuffer('RGBA', (size, size), buffer, 'raw', 'BGRA', 0, 1)

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
        print(f"Error: {e}")
        return None


def extract_icon_as_blob(icon_path, size=32):
    try:
        # print(icon_path.split(".")[-1])
        # if(icon_path.split(".")[-1] != "exe"):
        #     return extract_associated_icon_as_blob(icon_path)
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