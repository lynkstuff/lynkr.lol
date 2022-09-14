import type { Component } from "solid-js";
import { supabase } from "./lib/supabaseClient";

const Auth: Component = () => {
  async function signInWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }
  return (
    <div class={"flex w-full justify-center items-center"}>
      <button
        class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        onClick={signInWithDiscord}
      >
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <span class="flex flex-row items-center justify-center gap-1">
            <img
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/62594d3a27620a3b5c414341_2d20a45d79110dc5bf947137e9d99b66.svg"
              alt="Discord"
              width={"16px"}
              height={"16px"}
            />
            Login with Discord
          </span>
        </span>
      </button>
    </div>
  );
};

export default Auth;
