import { db } from './firebase'; 
import { ref, get, set, push, remove } from 'firebase/database';

const SHAPES_REF = 'customShapes';

export const saveShapes = async (shape) => {
  try {
    const shapesListRef = ref(db, SHAPES_REF);
    const newShapeRef = push(shapesListRef);
    await set(newShapeRef, {
      name: shape.name,
      displayName: shape.displayName,
      points: shape.points
    });
    return { ...shape, id: newShapeRef.key };
  } catch(error) {
    console.error("Error saving shape to RTDB:", error);
    throw error;
  }
};

export const loadShapes = async () => {
  try {
    const shapesRef = ref(db, SHAPES_REF);
    const snapshot = await get(shapesRef);

    if (snapshot.exists()) {
      const shapesObject = snapshot.val();
      const shapesArray = Object.keys(shapesObject).map(key => ({
        id: key, 
        ...shapesObject[key]
      }));
      return shapesArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error loading shapes from RTDB:", error);
    throw error;
  }
};

export const deleteShape = async (shapeId) => {
  try {
    const shapeRef = ref(db, `${SHAPES_REF}/${shapeId}`);
    await remove(shapeRef);
  } catch (error) {
    console.error("Error deleting shape from RTDB:", error);
    throw error;
  }
};