import React, { useRef, useEffect, useState } from 'react';
import { Input } from '../components/Input/Input'
import { Textarea } from '../components/Textarea/Textarea'
import { Button } from '../components/Button/Button'
import { Modal } from '../components/Modal/Modal'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../contexts/FormContext'


export const UbicacionStep = ({ register, setUbicacion }) => {
  const { updatePayload } = useFormPayload()
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMapInitializedRef = useRef(false);
  const { getValues, setValue } = useFormContext().methods
  const formData = getValues()
  const [textInput, setTextInput] = useState(
    formData['porQueMejorar'] || '',
  )

  const handleTextareaChange = (event) => {
    setTextInput(event.target.value)
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
          center: { lat: -12.1205, lng: -77.0301 },
          zoom: 15,
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

          console.log('Click en mapa:', coords);

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

        console.log('Mapa inicializado correctamente - UNA SOLA VEZ');
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKYwd1b4Sb3rOMlF_WlJt2TgZARHlTSdM`;
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
  const handleConfirm = () => {
    if (selectedCoords) {
      // Guardar las coordenadas en el formulario usando setValue
      setValue('latitud', selectedCoords.lat);
      setValue('longitud', selectedCoords.lng);
      // No sobrescribir direccionUsuario si el usuario ya escribió algo
      if (selectedCoords.address && !getValues('direccionUsuario')) {
        setValue('direccionUsuario', selectedCoords.address);
      }
      
      // También actualizar el contexto del payload
      updatePayload({
        latitud: selectedCoords.lat,
        longitud: selectedCoords.lng,
      });
      
      setIsLocationConfirmed(true);
    }
    setModalOpen(false);
  };

  return (
    <>
      <h2 className="title">Ubicación</h2>
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
                {/* {selectedCoords && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Coordenadas seleccionadas:</strong> <br />
                    Lat: {selectedCoords.lat}, Lng: {selectedCoords.lng}
                  </div>
                )} */}
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
              />
            </div>
          </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} shadowType="simple" modalType="wide" contentNoPadding contentRadius8>
        <div style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '320px', maxHeight: '700px' }}>
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
