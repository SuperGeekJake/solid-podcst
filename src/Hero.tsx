import { Component, createSignal, createEffect, Show } from "solid-js";
import axios from "axios";

import { styled, css } from "./styled";
import { useMediaContext } from "./MediaContext";
import { PlaySvg } from "./svg";

export const API_HOST = `https://data.podcst.io`;

const Hero: Component = () => {
  const [data, setData] = createSignal<App.Episode | undefined>();
  const [, playerActions] = useMediaContext();
  createEffect(() => {
    // TODO: Open issue on https://github.com/shantanuraj/podcst-api
    // API returns empty array when requesting only 1 when not cached
    axios
      .get<App.Podcast[]>(`${API_HOST}/top?limit=2`)
      .then((response) => response.data[0].feed)
      .then((podcastUrl) =>
        axios.get<App.EpisodeListing>(`${API_HOST}/feed?url=${podcastUrl}`)
      )
      .then((response) => setData(response.data.episodes[0]));
  });
  const handlePlay = () => {
    const episode = data();
    // Shouldn't happen as UI won't be visible
    if (!episode) return;
    playerActions.load([episode]);
  };
  return (
    <Root data-component={Hero.name}>
      <Show when={!!data()}>
        <HeroBackground src={data()?.cover || undefined} alt={data()?.title} />
        <HeroContent>
          <Title>{data()?.title}</Title>
          <Author>{data()?.author}</Author>
          <Description>{data()?.summary}</Description>
          <ActionList>
            <li>
              <PlayButton aria-label="Play" onClick={handlePlay}>
                <PlaySvg className={cssPlayIcon} />
              </PlayButton>
            </li>
            <li>
              <MoreAnchor href="#">More Info</MoreAnchor>
            </li>
          </ActionList>
        </HeroContent>
      </Show>
    </Root>
  );
};

export default Hero;

const Root = styled("div")`
  position: relative;
  padding-bottom: 39.5%;

  @media only screen and (max-width: 600px) {
    padding-bottom: 100%;
  }
`;

const HeroBackground = styled("img")`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  opacity: 0.7;
`;

const HeroContent = styled("div")`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 50px;
`;

const Title = styled("h3")`
  margin: 0;
  font-size: 2.2vw;
  font-weight: normal;
  text-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
`;

const Author = styled("h4")`
  margin: 0 0 1vw 0;
  font-size: 1.6vw;
`;

const Description = styled("p")`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 80%;
  max-width: 800px;
  margin: 0 0 1vw 0;

  color: #fff;
  font-size: 1.4vw;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 45%);
`;

const ActionList = styled("ul")`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: inline-block;
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const PlayButton = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 28px;
  cursor: pointer;
  width: 56px;
  height: 56px;
  background: #4f986d;
  border: none;
`;

const cssPlayIcon = css`
  width: auto;
  height: 26px;
  fill: #cccccc;

  &:hover {
    fill: #fff;
  }
`;

const MoreAnchor = styled("a")`
  display: inline-block;
  padding: 14px 32px;
  border-radius: 26px;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  color: #fff;
  cursor: pointer;
`;
