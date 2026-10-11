/** Registro central: qué actividades tiene cada mundo jugable. */
import { ANIMAL_ACTIVITIES } from './animals.js';
import { COLOR_ACTIVITIES } from './colors.js';
import { NUMBER_ACTIVITIES } from './numbers.js';

export const ACTIVITIES_BY_WORLD = {
  animales: ANIMAL_ACTIVITIES,
  colores: COLOR_ACTIVITIES,
  numeros: NUMBER_ACTIVITIES,
};

export function activitiesFor(worldId) {
  return ACTIVITIES_BY_WORLD[worldId] || [];
}

export function getActivity(worldId, activityId) {
  return activitiesFor(worldId).find((a) => a.id === activityId) || null;
}

/** Clave única de una actividad para el progreso guardado: "animales/memoria". */
export function activityKey(worldId, activityId) {
  return `${worldId}/${activityId}`;
}

export function allActivityKeys() {
  return Object.entries(ACTIVITIES_BY_WORLD).flatMap(([world, list]) => list.map((a) => activityKey(world, a.id)));
}
