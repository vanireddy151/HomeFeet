import React, { useState } from 'react';
import { MapPin, Square, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ORIGIN } from '../lib/api';
import LoginModal from './LoginModal';

interface Property {
  _id: string;
  title?: string;
  projectName?: string;
  locality?: string;
  city?: string;
  location?: string;
  totalArea: string;
  areaUnit?: string;
  developmentType: string;
  developerRatio: string;
  imageUrl: string;
  plotDiagramUrl?: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const title = property.projectName || property.title || `${property.developmentType?.replace(/-/g, ' ') || 'Development'} property`;
  const location = property.locality && property.city ? `${property.locality}, ${property.city}` : property.location || property.city || 'Hyderabad';
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
  const isDisplayableImage = (url = '') => url && !url.toLowerCase().includes('.pdf');
  const cardImageUrl = property.imageUrl || (isDisplayableImage(property.plotDiagramUrl) ? property.plotDiagramUrl : '');
  const isGeneratedDiagramPreview = !property.imageUrl && Boolean(cardImageUrl);

  const openDetails = () => {
    if (!localStorage.getItem('token')) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/property/${property._id}`);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48">
        <img
          src={cardImageUrl ? `${API_ORIGIN}${cardImageUrl}` : fallbackImage}
          alt={title}
          className={`h-full w-full ${isGeneratedDiagramPreview ? 'bg-white object-contain p-2' : 'object-cover'}`}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
            e.currentTarget.className = 'h-full w-full object-cover';
          }}
        />
        {property.developmentType && (
          <span className="absolute right-3 top-3 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold capitalize text-white shadow">
            {property.developmentType.replace(/-/g, ' ')}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-black capitalize text-slate-950">{title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-teal-700" />
          {location}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <Square className="mb-2 h-4 w-4 text-teal-700" />
            <p className="text-xs text-slate-500">Area</p>
            <p className="font-bold text-slate-950">{property.totalArea} {property.areaUnit || ''}</p>
          </div>
          {property.developerRatio && (
            <div className="rounded-lg bg-slate-50 p-3">
              <Users className="mb-2 h-4 w-4 text-teal-700" />
              <p className="text-xs text-slate-500">Ratio</p>
              <p className="font-bold text-slate-950">{property.developerRatio}</p>
            </div>
          )}
        </div>
        <button onClick={openDetails} className="mt-5 w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-teal-800">
          View Details
        </button>
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            navigate(`/property/${property._id}`);
          }}
        />
      )}
    </div>
  );
};

export default PropertyCard;
