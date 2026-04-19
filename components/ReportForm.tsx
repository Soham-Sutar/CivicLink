import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Department, Report } from '../types';
import { submitReport } from '../services/apiService';
import { suggestCategory } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon, PhotoIcon } from './icons';
import Spinner from './Spinner';

interface ReportFormProps {
  onSuccess: (newReport: Report) => void;
  isOpen: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSuccess, isOpen }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Department>(Department.POTHOLES);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsFetchingLocation(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsFetchingLocation(false);
        },
        (error) => {
          setLocationError(`Error: ${error.message}. Please enable location permissions.`);
          setIsFetchingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [isOpen]);

  // Map for selecting location
  useEffect(() => {
    if (!isOpen) return;
    if (!mapRef.current) return;
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);
      leafletMapRef.current.on('click', function (e: any) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current!);
          markerRef.current.on('dragend', function (ev: any) {
            const pos = ev.target.getLatLng();
            setLocation({ lat: pos.lat, lng: pos.lng });
          });
        }
      });
    }
    // Set marker to current location
    if (location && leafletMapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([location.lat, location.lng]);
      } else {
        markerRef.current = L.marker([location.lat, location.lng], { draggable: true }).addTo(leafletMapRef.current!);
        markerRef.current.on('dragend', function (ev: any) {
          const pos = ev.target.getLatLng();
          setLocation({ lat: pos.lat, lng: pos.lng });
        });
      }
      leafletMapRef.current.setView([location.lat, location.lng], 14);
    }
    // Cleanup on close
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off();
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, location]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestCategory = async () => {
    if (!imagePreview || !description) {
      alert('Please provide a description and an image to suggest a category.');
      return;
    }
    setSuggesting(true);
    try {
      const base64Image = imagePreview;
      const suggested = await suggestCategory(base64Image, description);
      
      if (Object.values(Department).includes(suggested as Department)) {
        setCategory(suggested as Department);
      } else {
        alert(`AI suggested "${suggested}", which is not a valid category. Please select manually.`);
      }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get suggestion from AI.';
        alert(message);
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert('Please fill all fields and upload an image.');
      return;
    }
    if (!location) {
      alert('Location is required to submit a report.');
      return;
    }
    if (!user) {
      alert('You must be logged in to submit a report.');
      return;
    }

    setSubmitting(true);
    try {
      // Use base64 image string for imageUrl
      const imageUrl = imagePreview || '';
      const newReportData = { title, description, category, imageUrl, location };
      const newReport = await submitReport(newReportData, { id: user.id });
      onSuccess(newReport);
      // Reset form and close modal if available
      setTitle('');
      setDescription('');
      setCategory(Department.POTHOLES);
      setImage(null);
      setImagePreview(null);
      setLocation(null);
      setLocationError(null);
    } catch (error) {
      alert('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <div className="mt-1 p-3 w-full rounded-md border border-gray-300 bg-gray-50 text-sm">
          {isFetchingLocation && <p className="text-gray-500">Getting your location...</p>}
          {locationError && <p className="text-red-600">{locationError}</p>}
          {location && <p className="text-green-700">Location: ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</p>}
          <div style={{ width: '100%', height: '250px', marginTop: 8, borderRadius: 8, overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Click on the map to select a location, or drag the marker. By default, your current location is used.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
            ) : (
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Department)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
            {Object.values(Department).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleSuggestCategory}
          disabled={suggesting || !imagePreview || !description}
          className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
        >
          {suggesting ? <Spinner small /> : <SparklesIcon className="h-5 w-5" />}
          <span>AI Suggest</span>
        </button>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={submitting || !location}
          className="w-full sm:w-auto flex justify-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {submitting ? <Spinner small /> : 'Submit Report'}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;