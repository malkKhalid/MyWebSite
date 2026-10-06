import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImageBase64: string) => void;
    onCancel: () => void;
    aspect?: number; // Default 1:1
    maxDim?: number; // Longest side of the output (keeps uploads small)
    format?: 'jpg' | 'png'; // jpg = white background, png = keeps transparency
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel, aspect = 1, maxDim = 1400, format = 'jpg' }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspect);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return '';
        }

        const scale = Math.min(1, maxDim / Math.max(pixelCrop.width, pixelCrop.height));
        const outW = Math.max(1, Math.round(pixelCrop.width * scale));
        const outH = Math.max(1, Math.round(pixelCrop.height * scale));

        canvas.width = outW;
        canvas.height = outH;

        if (format === 'jpg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outW, outH);
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            outW,
            outH
        );

        return format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.86);
    };

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adjust Image</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative flex-1 bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={currentAspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Aspect Ratio Selector */}
                    <div className="flex gap-2 justify-center pb-2">
                        <button
                            onClick={() => setCurrentAspect(undefined)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-colors ${currentAspect === undefined ? 'bg-maroon text-white border-maroon' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent'}`}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => setCurrentAspect(1)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-colors ${currentAspect === 1 ? 'bg-maroon text-white border-maroon' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent'}`}
                        >
                            1:1 (Square)
                        </button>
                        <button
                            onClick={() => setCurrentAspect(16 / 9)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-colors ${currentAspect === 16 / 9 ? 'bg-maroon text-white border-maroon' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent'}`}
                        >
                            16:9
                        </button>
                        <button
                            onClick={() => setCurrentAspect(4 / 3)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-colors ${currentAspect === 4 / 3 ? 'bg-maroon text-white border-maroon' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent'}`}
                        >
                            4:3
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-5 h-5 text-gray-500" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-maroon"
                        />
                        <ZoomIn className="w-5 h-5 text-gray-500" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 rounded-xl bg-maroon text-white font-bold hover:bg-[#7a0d2d] transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" /> Save Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
