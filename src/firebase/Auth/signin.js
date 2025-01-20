import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const signIn = async (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

export default signIn;