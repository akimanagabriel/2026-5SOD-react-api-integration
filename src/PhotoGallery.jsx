import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const observerTarget = useRef(null);

  const fetchPhotos = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://boringapi.com/api/v1/photos?page=${pageNum}`,
      );
      const data = await res.json();
      setPhotos((prev) =>
        pageNum === 1 ? data.photos : [...prev, ...data.photos],
      );
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && page < 30) {
        fetchPhotos(page + 1);
      }
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, page, fetchPhotos]);

  const navigatePhoto = (direction) => {
    const currentIdx = photos.findIndex((p) => p.id === selectedPhoto.id);
    let newIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;

    if (newIdx >= 0 && newIdx < photos.length) {
      setSelectedPhoto(photos[newIdx]);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="text-slate-400 mt-1">Discover beautiful moments</p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative overflow-hidden rounded-xl bg-slate-800 cursor-pointer h-64 sm:h-72"
              style={{
                gridRowEnd: `span ${Math.ceil((photo.height / photo.width) * 2)}`,
              }}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2">
                  {photo.title}
                </h3>
                <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                  {photo.description}
                </p>
              </div>

              {/* Image Info Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.width} × {photo.height}
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-3 border-slate-700 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div
          ref={observerTarget}
          className="h-4 mt-12"
        />
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                photos.findIndex((p) => p.id === selectedPhoto.id) === 0
              }
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Image Container */}
            <div className="flex flex-col items-center gap-4 max-w-4xl w-full">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedPhoto.title}
                </h2>
                <p className="text-slate-300 mb-4">
                  {selectedPhoto.description}
                </p>
                <div className="flex gap-6 text-sm text-slate-400">
                  <div>
                    <span className="text-slate-500">Dimensions: </span>
                    <span className="text-slate-200">
                      {selectedPhoto.width} × {selectedPhoto.height}px
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Size: </span>
                    <span className="text-slate-200">
                      {selectedPhoto.file_size}KB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                photos.findIndex((p) => p.id === selectedPhoto.id) ===
                photos.length - 1
              }
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
              {photos.findIndex((p) => p.id === selectedPhoto.id) + 1} /{" "}
              {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
