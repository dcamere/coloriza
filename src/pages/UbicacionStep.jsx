import React, { useRef, useEffect, useState } from 'react';
import { Input } from '../components/Input/Input'
import { Textarea } from '../components/Textarea/Textarea'
import { Button } from '../components/Button/Button'
import { Modal } from '../components/Modal/Modal'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../contexts/FormContext'
import { FaSearch } from 'react-icons/fa'


export const UbicacionStep = ({ register, setUbicacion }) => {
  const { updatePayload } = useFormPayload()
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMapInitializedRef = useRef(false);
  const methods = useFormContext()
  const formData = methods.getValues()
  const { formState: { errors }, trigger } = methods;
  const [textInput, setTextInput] = useState(
    formData['porQueMejorar'] || '',
  )

  const handleTextareaChange = async (event) => {
    setTextInput(event.target.value)
    // También disparar validación en tiempo real
    await trigger('porQueMejorar');
  }

  // Función para manejar el blur y disparar validación
  const handleBlur = async (fieldName) => {
    await trigger(fieldName);
  }

  // Función para manejar el cambio y disparar validación en tiempo real
  const handleChange = async (fieldName) => {
    await trigger(fieldName);
  }

  useEffect(() => {
    if (selectedCoords !== null) setIsLocationConfirmed(true);
  }, [selectedCoords]);

  // Inicializar el mapa solo cuando el modal se abre por primera vez
  useEffect(() => {
    if (!modalOpen || isMapInitializedRef.current) return;

    const initializeMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      
      try {
        const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: -12.0464, lng: -77.0428 }, // Centro aproximado Lima
          zoom: 11, // Zoom para mostrar Lima y Callao
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        mapInstanceRef.current = mapInstance;
        isMapInitializedRef.current = true;

        // Listener para clicks en el mapa
        mapInstance.addListener('click', (e) => {
          const coords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          // Limpiar marcador anterior
          if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
          }

          // Crear nuevo marcador
          const marker = new window.google.maps.Marker({
            position: coords,
            map: mapInstance,
            animation: window.google.maps.Animation.DROP
          });

          markerRef.current = marker;
          setSelectedCoords(coords);
        });

        console.log('Mapa inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
      }
    };

    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setTimeout(initializeMap, 100); // Delay para asegurar que el DOM esté listo
        return;
      }

      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setTimeout(initializeMap, 100);
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB9Ien7Gy2gPnCFhps0A8e9URKRVgLtZSE&libraries=places`;
      script.async = true;
      script.onload = () => {
        setTimeout(initializeMap, 100);
      };
      script.onerror = () => {
        console.error('Error al cargar Google Maps');
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [modalOpen]);

  // Guardar coordenadas seleccionadas en el payload final
  const handleConfirm = async () => {
    if (selectedCoords) {
      // Guardar las coordenadas en el formulario usando setValue
      methods.setValue('latitud', selectedCoords.lat);
      methods.setValue('longitud', selectedCoords.lng);
      // No sobrescribir direccionUsuario si el usuario ya escribió algo
      if (selectedCoords.address && !methods.getValues('direccionUsuario')) {
        methods.setValue('direccionUsuario', selectedCoords.address);
      }
      
      // También actualizar el contexto del payload
      updatePayload({
        latitud: selectedCoords.lat,
        longitud: selectedCoords.lng,
      });
      
      // Disparar validación de los campos de coordenadas
      await trigger(['latitud', 'longitud']);
      
      setIsLocationConfirmed(true);
    }
    setModalOpen(false);
  };

  // Buscar dirección y colocar pin
  const handleSearchAddress = async (address) => {
    const query = address || searchAddress;
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          };
          // Limpiar marcador anterior
          if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
          }
          // Crear nuevo marcador
          const marker = new window.google.maps.Marker({
            position: coords,
            map: mapInstanceRef.current,
            animation: window.google.maps.Animation.DROP
          });
          markerRef.current = marker;
          setSelectedCoords(coords);
          mapInstanceRef.current.setCenter(coords);
          mapInstanceRef.current.setZoom(16);
          setShowSuggestions(false);
        } else {
          alert('No se encontró la dirección.');
        }
        setIsSearching(false);
      });
    } catch (error) {
      setIsSearching(false);
      alert('Error buscando la dirección.');
    }
  };

  // Autocomplete de direcciones
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    if (!searchAddress.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: searchAddress, componentRestrictions: { country: 'pe' } }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }, [searchAddress]);

  return (
    <>
      <div className="form-container">
        {/* Campos ocultos para validación de coordenadas */}
        <input type="hidden" {...register('latitud')} />
        <input type="hidden" {...register('longitud')} />
        
        <div className='f-group'>
          <div>
            <h2>Dirección y referencia</h2>
            <Input
              placeholder="Escribe la dirección"
              register={register}
              type="text"
              name="direccionUsuario"
              error={errors.direccionUsuario}
              onBlur={() => handleBlur('direccionUsuario')}
              onChange={() => handleChange('direccionUsuario')}
            />
          </div>
          <div>
            <h2>Ubicación y coordenadas</h2>
            {isLocationConfirmed ? (
              <div style={{ position: 'relative'}}>
                <a
                  className="button-map button-map--selected"
                  href={`https://www.google.com/maps?q=${selectedCoords.lat},${selectedCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', position: 'relative', paddingRight: '32px' }}
                >
                  <span>Link de la ubicación guardada</span>
                  <img src="/maps-active.svg" alt="Maps icon" />
                  <button 
                    type="button" 
                    aria-label="Reset ubicación"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onClick={e => {
                      e.preventDefault();
                      setSelectedCoords(null);
                      setIsLocationConfirmed(false);
                    }}
                  >
                    <img src="/maps-close.svg" alt="Cerrar ubicación" width="16" height="16" />
                  </button>
                </a>
              </div>
            ) : (
              <>
                <Button 
                  className="button-map" 
                  onClick={() => setModalOpen(true)} 
                  type="button"
                >
                  <span>Abrir en Google Maps aquí</span>
                  <img src="/maps.svg" alt="Maps icon" />
                </Button>
                {/* Mostrar error de coordenadas si existe */}
                {(errors.latitud || errors.longitud) && (
                  <span className="error-message" style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '4px', fontWeight: '500' }}>
                    {errors.latitud?.message || errors.longitud?.message}
                  </span>
                )}
                {/* {selectedCoords && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Coordenadas seleccionadas:</strong> <br />
                    Lat: {selectedCoords.lat}, Lng: {selectedCoords.lng}
                  </div>
                } */}
              </>
            )}
          </div>
        </div>
        <div className="f-group w-100">
            <div style={{width: '100%'}}>
              <h2>¿Por qué quisieras mejorar este lugar?</h2>
              <Textarea
                textInput={textInput}
                register={register}
                name="porQueMejorar"
                placeholder="Escribe por qué quisieras mejorar este lugar..."
                maxLength="200"
                cleanOption={handleTextareaChange}
                error={errors.porQueMejorar}
                onBlur={() => handleBlur('porQueMejorar')}
              />
            </div>
          </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} shadowType="simple" modalType="wide" contentNoPadding contentRadius8>
        <div style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '320px', maxHeight: '700px' }}>
          {/* Input de búsqueda de dirección */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: '90%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '8px 12px',
          }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={searchAddress}
                onChange={e => setSearchAddress(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearchAddress(); }}
                placeholder="Buscar dirección..."
                style={{ flex: 1, fontSize: '16px', border: 'none', outline: 'none', background: 'transparent', padding: '4px 0' }}
                disabled={isSearching}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => handleSearchAddress()}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', display: 'flex', alignItems: 'center' }}
                disabled={isSearching}
                aria-label="Buscar dirección"
              >
                <FaSearch style={{ fontSize: '20px', color: '#222' }} />
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{
                width: '100%',
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                margin: 0,
                padding: '4px 0',
                listStyle: 'none',
                position: 'absolute',
                top: '44px',
                left: 0,
                zIndex: 20,
                maxHeight: '180px',
                overflowY: 'auto',
              }}>
                {suggestions.map(s => (
                  <li
                    key={s.place_id}
                    style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '15px', color: '#222' }}
                    onClick={() => {
                      setSearchAddress(s.description);
                      handleSearchAddress(s.description);
                    }}
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div 
            ref={mapContainerRef}
            style={{ 
              width: '100%', 
              height: '100%',
              backgroundColor: '#e5e5e5'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '6px',
            width: '90%',
            maxWidth: '458px',
            background: 'rgba(21, 21, 21, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30,
            padding: '16px',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            color: 'white'
          }}>
            <div>
              {selectedCoords ? (
                <span>
                  <strong>Coordenadas:</strong> {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                </span>
              ) : (
                <span>Haz click en el mapa para seleccionar un punto</span>
              )}
            </div>
            <Button onClick={handleConfirm} className="button mt0" type="button" disabled={!selectedCoords}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
