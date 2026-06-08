import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import axios from "axios";
function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );
      await axios.post(
  "http://localhost:5000/api/auth/google-login",
  {
    firebaseUid: result.user.uid,
    name: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL
  }
);


      console.log(result.user);

      alert(
        `Welcome ${result.user.displayName}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign In With Google
      </button>
    </div>
  );
}

export default Login;