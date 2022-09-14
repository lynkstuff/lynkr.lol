import { Component, createEffect, createSignal } from "solid-js";
import { supabase } from "./lib/supabaseClient";
import { AuthSession } from "@supabase/supabase-js";
import Account from "./Account";
import Auth from "./Auth";

const Header: Component = () => {
  return (
    <div
      class={
        "flex items-center justify-center p-8 w-full bg-gray-100 border-b-8 border-violet-500"
      }
    >
      <img src="/LYNKR.png" alt="LYNK::R" width="200px" height="auto" />
    </div>
  );
};

export default Header;
