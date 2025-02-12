import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const serviceSignin = async (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

export default serviceSignin;