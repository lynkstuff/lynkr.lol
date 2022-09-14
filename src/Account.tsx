import { AuthSession } from "@supabase/supabase-js";
import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { supabase } from "./lib/supabaseClient";

interface Props {
  session: AuthSession;
}

interface SitesData {
  name: string;
  url: string;
  hex: string;
}

interface WebData {
  sites: SitesData[];
}

const Account: Component<Props> = ({ session }) => {
  const discordUser = session.user.user_metadata;
  const [loading, setLoading] = createSignal<boolean>(true);
  const [webData, setWebData] = createSignal<WebData>({ sites: [] });

  // Temporary Variable
  let [site, setSiteData] = createSignal<SitesData>({
    hex: "#ffffff",
    name: "",
    url: "",
  });

  createEffect(() => {
    getProfile();
  });

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`web_data`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        console.log(status);
        throw error;
      }

      if (data) {
        setWebData(data.web_data);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const updateProfile = async (e: Event) => {
    e.preventDefault();

    try {
      const { user } = session;

      const updates = {
        id: user.id,
        web_data: webData(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const deleteSite = (e, index: number) => {
    webData().sites.splice(index, 1);
    setWebData({ sites: webData().sites });

    updateProfile(e);
  };

  const addSite = (e) => {
    if (site().url !== "") {
      if (
        site().url.startsWith("http://") ||
        site().url.startsWith("https://")
      ) {
        setSiteData({ ...site(), url: site().url.split("://")[1] });
      }
      webData().sites.push(site());
    }
    setWebData({ sites: webData().sites });
    setSiteData({ hex: "#ffffff", name: "", url: "" });

    updateProfile(e);
  };

  return (
    <div
      class={
        "flex flex-col w-full justify-center md:px-24 md:items-start items-center gap-4"
      }
    >
      <div class="flex flex-col">
        <h1 class={"text-4xl"}>👋Hello, {discordUser?.name.split("#")[0]}</h1>
      </div>
      {/*<div class="flex flex-row gap-2">*/}
      {/*  <h1 class={"text-2xl"}>Search links:</h1>*/}
      {/*  <input type="text" class={"border border-blue-500 focus:outline-none focus:ring ring-blue-500 p-1 rounded-lg"}/>*/}
      {/*</div>*/}
      <h1 class={"text-2xl"}>Your saved links:</h1>
      <div class={"grid md:grid-cols-3 grid-cols-1 gap-4"}>
        <Show when={webData().sites.length > 0}>
          <For each={webData().sites}>
            {(site, idx) => (
              <div
                class={
                  "border-2 flex flex-col items-center justify-center rounded-lg p-3"
                }
                style={`background-color: ${site.hex}`}
              >
                <span class={"text-xl"}>{site?.name}</span> <br />
                <a
                  href={`//${site?.url}`}
                  class={"text-blue-500 hover:text-blue-600 hover:underline"}
                >
                  {site?.url}
                </a>{" "}
                <br />
                <button onClick={(e) => deleteSite(e, idx())}>(delete)</button>
              </div>
            )}
          </For>
        </Show>
        <form onSubmit={addSite}>
          <div
            class={
              "border-2 flex flex-col items-center justify-center rounded-lg p-3 gap-2"
            }
          >
            <input
              type="text"
              value={site().name}
              class={
                "border border-blue-500 p-1 rounded-lg focus:outline-none focus:ring ring-blue-500"
              }
              placeholder={"Name (Optional)"}
              onChange={(e) =>
                setSiteData({ ...site(), name: e.currentTarget.value })
              }
            />
            <input
              type="text"
              value={site().url}
              class={
                "border border-blue-500 p-1 rounded-lg focus:outline-none focus:ring ring-blue-500"
              }
              placeholder={"URL"}
              onChange={(e) =>
                setSiteData({ ...site(), url: e.currentTarget.value })
              }
            />
            <input
              type="color"
              class={"border focus:outline-none focus:ring ring-blue-500"}
              value={site().hex}
              onChange={(e) =>
                setSiteData({ ...site(), hex: e.currentTarget.value })
              }
            />
            <input
              type="submit"
              class={"bg-green-500 text-white p-1 rounded-lg text-base"}
            />
          </div>
        </form>
      </div>
      <button
        onClick={() => supabase.auth.signOut()}
        class={
          "bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg"
        }
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
