import React, { useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Leaflet from 'leaflet';
import { Link } from 'react-router-dom';
import mapMarkerImg from './../../assets/images/map-marker.svg';
import './styles.css';
import api from '../../services/api';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [178, 2]
});

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const OrphanagesMap: React.FC = () => {

  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(()=> {
    api.get('/orphanages').then(r => {
      setOrphanages(r.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        
        <header>
          <img src={mapMarkerImg} alt="Happy"/>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Uberlândia</strong>
          <span>Minas Gerais</span>
        </footer>

      </aside>

      <Map 
        center={[-18.9358685,-48.2294025]} 
        zoom={13} 
        style={{ width:'100%', height:'100%' }}
      >
        <TileLayer 
          url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        {orphanages.map(o => {
          return (
            <Marker 
              icon={mapIcon}
              position={[o.latitude, o.longitude]}
              key={o.id}
            >
              <Popup 
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {o.name}
                <Link to={`/orphanages/${o.id}`}>
                  <FiArrowRight size={20} color="#fff"/>
                </Link>
              </Popup>
            </Marker>
          );
        })}
          
      </Map>

      <Link to ="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
};

export default OrphanagesMap;
