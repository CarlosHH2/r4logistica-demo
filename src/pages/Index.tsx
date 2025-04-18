
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
