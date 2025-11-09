import { db } from './firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const SHAPES_COLLECTION = 'customShapes';

export const saveShapes= async (shape)=>{
    try{
        const docRef = await addDoc(collection(db, SHAPES_COLLECTION), {
      name: shape.name,
      displayName: shape.displayName,
      points: shape.points
    });
    return { ...shape, id: docRef.id };
    }
    catch(error){
    console.error("Error saving shape:", error);
    throw error;
    }
    
};
export const loadShapes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SHAPES_COLLECTION));
    const shapes = [];
    querySnapshot.forEach((doc) => {
      shapes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return shapes;
  } catch (error) {
    console.error("Error loading shapes:", error);
    throw error;
  }
};

export const deleteShape = async (shapeId) => {
  try {
    await deleteDoc(doc(db, SHAPES_COLLECTION, shapeId));
  } catch (error) {
    console.error("Error deleting shape:", error);
    throw error;
  }
};

