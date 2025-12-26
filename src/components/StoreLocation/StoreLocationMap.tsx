'use client'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { StoreLocationType } from '@/type/StoreLocationType'
import { MapPin, Phone, Envelope, Clock } from "@phosphor-icons/react"

// Fix for default marker icons in Next.js - only run on client side
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface StoreLocationMapProps {
  locations: StoreLocationType[]
  selectedLocationId?: string | null
}

// Component to handle map centering when selectedLocationId changes
function MapCenterHandler({ selectedLocationId, locations }: { selectedLocationId?: string | null; locations: StoreLocationType[] }) {
  const map = useMap()

  useEffect(() => {
    if (selectedLocationId) {
      const selectedLocation = locations.find((loc) => loc.id === selectedLocationId)
      if (selectedLocation) {
        const { lat, lng } = selectedLocation.coordinates
        // Validate coordinates before centering
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          map.setView([lat, lng], 15, { animate: true })
        }
      }
    }
  }, [selectedLocationId, locations, map])

  return null
}

const StoreLocationMap: React.FC<StoreLocationMapProps> = ({ locations, selectedLocationId }) => {
  const [isMounted, setIsMounted] = useState(false)
  const mapKeyRef = useRef(`map-${Date.now()}`)

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Validate and filter locations with valid coordinates
  const validLocations = useMemo(() => {
    return locations.filter((location) => {
      const { lat, lng } = location.coordinates
      return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        !isNaN(lat) &&
        !isNaN(lng)
      )
    })
  }, [locations])

  // Default center point for Indonesia (approximate center of the country)
  const INDONESIA_CENTER: [number, number] = [-2.5, 118.0]
  const INDONESIA_ZOOM = 5 // Zoom level to show entire Indonesia

  // Calculate center point from all valid locations
  const mapCenter = useMemo(() => {
    // Default to Indonesia center
    if (validLocations.length === 0) {
      return INDONESIA_CENTER
    }

    // If there are locations, we can still start with Indonesia view
    // The MapCenterHandler will center on selected location when clicked
    // For initial load, show Indonesia to give context
    return INDONESIA_CENTER
  }, [validLocations])

  // Calculate appropriate zoom level
  const zoomLevel = useMemo(() => {
    // Default to Indonesia zoom level to show the entire country
    return INDONESIA_ZOOM
  }, [])

  // Handle empty state
  if (validLocations.length === 0) {
    return (
      <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line flex items-center justify-center bg-surface">
        <div className="text-center p-8">
          <div className="body1 text-secondary">No valid store locations to display on map.</div>
        </div>
      </div>
    )
  }

  // Don't render map until component is mounted on client
  if (!isMounted) {
    return (
      <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line flex items-center justify-center bg-surface">
        <div className="text-center p-8">
          <div className="body1 text-secondary">Loading map...</div>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line">
        <MapContainer
          key={mapKeyRef.current}
          center={mapCenter}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0"
          whenCreated={(mapInstance) => {
            // Ensure map is properly initialized
            if (mapInstance) {
              mapInstance.invalidateSize()
            }
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validLocations.map((location) => (
            <Marker key={location.id} position={[location.coordinates.lat, location.coordinates.lng]}>
              <Popup maxWidth={300} className="store-location-popup">
                <div className="p-4 min-w-[250px]">
                  <div className="font-semibold text-base mb-3 text-black">{location.name}</div>
                  
                  <div className="space-y-2 text-sm">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Address</div>
                        <div className="text-gray-800">{location.address}</div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-2">
                      <Phone size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                        <a 
                          href={`tel:${location.phone}`} 
                          className="text-gray-800 hover:text-blue-600 hover:underline"
                        >
                          {location.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    {location.email && (
                      <div className="flex items-start gap-2">
                        <Envelope size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Email</div>
                          <a 
                            href={`mailto:${location.email}`} 
                            className="text-gray-800 hover:text-blue-600 hover:underline break-all"
                          >
                            {location.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Opening Hours */}
                    <div className="flex items-start gap-2">
                      <Clock size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Opening Hours</div>
                        <div className="space-y-0.5 text-gray-800">
                          <div className="text-xs">{location.hours.weekdays}</div>
                          <div className="text-xs">{location.hours.saturday}</div>
                          <div className="text-xs">{location.hours.sunday}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Get Directions Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          <MapCenterHandler selectedLocationId={selectedLocationId} locations={validLocations} />
        </MapContainer>
      </div>
    )
  } catch (error) {
    console.error('Error rendering map:', error)
    return (
      <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line flex items-center justify-center bg-surface">
        <div className="text-center p-8">
          <div className="body1 text-red-500">Failed to load map. Please try again later.</div>
        </div>
      </div>
    )
  }
}

export default StoreLocationMap

