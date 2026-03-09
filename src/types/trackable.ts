export interface ITrackedObject {
  id: string;
  lat: number;
  lng: number;
  direction: number;
  lastSeen: number;
  status: 'active' | 'lost';
}

export interface IObjectUpdate {
  id: string;
  lat: number;
  lng: number;
  direction: number;
}

export interface IObjectMarkerProps {
  obj: ITrackedObject;
}

export type TRowProps = {
  objects: ITrackedObject[];
};
