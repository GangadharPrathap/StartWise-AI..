import React from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Globe, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { cn } from '../utils/helpers';
import { investors } from '../utils/constants';

const ChangeView = ({ center, zoom, map }) => {
  React.useEffect(() => {
    if (map) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

import { useAppStore } from '../store/useAppStore';

const DEFAULT_CITIES = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const CITY_COORDS = {
  'Delhi NCR': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Pune': [18.5204, 73.8567]
};

const InvestorMap = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    result,
    setSelectedInvestor,
    selectedInvestor,
    setSelectedInvestorForMeeting
  } = useAppStore();

  const [mapType, setMapType] = React.useState('roadmap');
  const [map, setMap] = React.useState(null);

  const cities = DEFAULT_CITIES;
  const cityCoords = CITY_COORDS;

  return (
    <motion.div
      key="map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">Investors Near You</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-all",
                c === selectedCity ? "bg-accent border-accent text-white" : "bg-gray-800 border-gray-700 text-muted-text hover:border-gray-500"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#050505] h-[400px] md:h-[500px] rounded-2xl border border-border relative overflow-hidden mb-8">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setMapType('roadmap')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 backdrop-blur-md",
              mapType === 'roadmap' ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-black/50 text-gray-400 border-white/10 hover:bg-black/70"
            )}
          >
            <MapIcon size={12} /> Roadmap
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 backdrop-blur-md",
              mapType === 'satellite' ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-black/50 text-gray-400 border-white/10 hover:bg-black/70"
            )}
          >
            <Globe size={12} /> Satellite
          </button>
        </div>

        <MapContainer
          center={cityCoords[selectedCity]}
          zoom={12}
          className="w-full h-full z-0"
          scrollWheelZoom={true}
          ref={setMap}
        >
          <ChangeView center={cityCoords[selectedCity]} zoom={12} map={map} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={mapType === 'satellite' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" : "https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"}
          />
          {(result && result.city === selectedCity && result.localInvestors ? result.localInvestors : investors.filter(inv => inv.city.toLowerCase() === selectedCity.toLowerCase())).map((inv, idx) => {
            const position = inv.lat && inv.lng ? [inv.lat, inv.lng] : null;
            if (!position) return null;

            return (
              <Marker
                key={inv.id || idx}
                position={position}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <p className="text-sm font-bold text-gray-900 mb-1">{inv.name}</p>
                    <p className="text-[10px] text-gray-600 mb-2 truncate">{inv.officeAddress || inv.fund}</p>
                    <button
                      onClick={() => {
                        setSelectedInvestor(inv);
                      }}
                      className="w-full bg-accent text-white text-[10px] font-bold py-1 rounded hover:bg-blue-600 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-white flex items-center gap-2 z-10">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          📍 {selectedCity} — Showing real-time results from OpenStreetMap
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(result && result.city === selectedCity && result.localInvestors ? result.localInvestors : investors.filter(inv => inv.city.toLowerCase() === selectedCity.toLowerCase())).map((inv, idx) => (
          <div
            key={inv.id || idx}
            onClick={() => {
              setSelectedInvestor(inv);
            }}
            className={cn(
              "glass-card-glow rounded-3xl p-5 border transition-all cursor-pointer flex items-center gap-5 group relative overflow-hidden",
              selectedInvestor?.id === inv.id ? "border-accent ring-1 ring-accent/50" : "border-white/10 hover:border-accent/40"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold text-white bg-accent shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform relative z-10">
              {inv.name?.substring(0, 2).toUpperCase() || inv.initials}
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{inv.name}</h4>
                {inv.distance && <span className="text-[10px] glass3d animate-pulse-glow text-success px-2 py-0.5 rounded-full"><span>{inv.distance}</span></span>}
              </div>
              <p className="text-muted-text text-xs line-clamp-1">{inv.officeAddress || inv.fund}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInvestorForMeeting(inv);
                  window.location.href = '/meetings';
                }}
                className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
              >
                Book Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InvestorMap;
