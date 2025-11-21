import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading)
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "#050816",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>GabbarInfo AI</h1>

      {!user ? (
        <button
          onClick={signInWithGoogle}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "purple",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p style={{ marginTop: "20px" }}>Logged in as: {user.email}</p>

          <button
            onClick={signOut}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "red",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </>
      )}
    </main>
  );
}
