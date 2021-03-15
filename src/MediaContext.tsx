import {
  Component,
  createContext,
  createState,
  createEffect,
  useContext,
  createMemo,
} from "solid-js";
import { Howl, Howler, HowlErrorCallback } from "howler";

export interface MediaState {
  status: "idle" | "loading" | "playing" | "paused";
  error: Error | null;
  playlist: App.Episode[];
  track: number;
  seek?: number;
  volume: number;
}

type ContextValue = [
  MediaState,
  {
    load: (playlist: App.Episode[]) => void;
    toggle: () => void;
    volume: (value: number) => void;
    seek: (value: number) => void;
  }
];

export const MediaContext = createContext<ContextValue | []>([]);

type Seek = number | undefined;

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context.length)
    throw new Error("usePlayerContext has been used outside provider");
  return context;
};

export const MediaProvider: Component = (props) => {
  let howl: Howl | null;
  const [state, setState] = createState<MediaState>({
    status: "idle",
    error: null,
    playlist: [],
    track: 0,
    seek: 0,
    volume: Howler.volume(),
  });
  const value: ContextValue = [
    state,
    {
      load: (playlist) => {
        const volume = Howler.volume();
        setState({
          status: "loading",
          error: null,
          track: 0,
          seek: undefined,
          playlist,
          volume,
        });
      },
      toggle: () => {
        if (!howl) return;
        if (state.status !== "playing" && state.status !== "paused") return;
        howl[state.status === "playing" ? "pause" : "play"]();
      },
      volume: (value) => {
        Howler.volume(value);
        setState({ volume: value });
      },
      seek: (value) => {
        if (!howl) return;
        howl.seek(value);
      },
    },
  ];
  const sources = createMemo<string[]>(() =>
    state.playlist.map((episode) => episode.file.url)
  );
  const handlePause = () => {
    if (!howl) return;
    const seek = (howl.seek() as Seek) || 0;
    setState({
      status: "paused",
      seek,
    });
  };
  const handleSeek = () => {
    if (!howl) return;
    const seek = (howl.seek() as Seek) || 0;
    setState({ seek });
  };
  const handlePlay = () => {
    if (!howl) return;
    const seek = (howl.seek() as Seek) || 0;
    setState({
      status: "playing",
      error: null,
      seek,
    });
  };
  const handleEnd = () => {
    setState((prevState) => ({
      status: "loading",
      error: null,
      track: ++prevState.track,
      seek: 0,
    }));
  };
  const handleError: HowlErrorCallback = (_, error) => {
    if (!howl) return;
    setState({ error: error as Error });
  };
  createEffect(() => {
    if (state.status === "loading") {
      // If was playing, reset and begin new track
      if (howl) howl.unload();

      howl = new Howl({
        src: sources(),
        html5: true,
        autoplay: true,
        onpause: handlePause,
        onseek: handleSeek,
        onplay: handlePlay,
        onend: handleEnd,
        onloaderror: handleError,
        onplayerror: handleError,
      });
    }

    if (state.status === "idle") {
      if (!howl) return;
      howl.unload();
      howl = null;
    }
  });

  let intervalID: number | undefined;
  createEffect(() => {
    if (state.status === "playing") {
      intervalID = setInterval(() => {
        // TODO: Should probably throw an error
        if (!howl) return clearInterval(intervalID);
        setState({ seek: Math.floor(howl.seek() as number) });
      }, 250);
      return;
    }

    if (intervalID) clearInterval(intervalID);
  });

  return (
    <MediaContext.Provider value={value}>
      {props.children}
    </MediaContext.Provider>
  );
};
