import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../features/authentication/authenticationSlice";

// Drop <GoogleAuthButton /> into Login.jsx or Register.jsx — same
// component works for both, since the backend automatically creates
// an account on first Google sign-in (no separate "register" flow
// needed for Google users).
export default function GoogleAuthButton() {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: "83371585750-bfi59g3li08msnfri607fqovm2m72dko.apps.googleusercontent.com",
      callback: (response) => {
        dispatch(googleLogin(response.credential));
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "filled_black",
      size: "large",
      width: 420,
      shape: "rectangular",
      text: "continue_with",
    });
  }, [dispatch]);

  return <div ref={buttonRef} style={{ display: "flex", justifyContent: "center" }} />;
}
