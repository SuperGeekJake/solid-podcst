import { Properties as CSSProperties } from "csstype";
import { css, setup as gooberSetup, Tagged } from "goober";
import {
  JSX,
  mergeProps,
  splitProps,
  createContext,
  useContext,
  createComponent,
  Component,
  ComponentProps,
} from "solid-js";
import { spread, ssr, ssrSpread, isServer } from "solid-js/web";

export { css, glob, extractCss, keyframes } from "goober";

export interface CSSAttribute extends CSSProperties {
  [key: string]: CSSAttribute | string | number | undefined;
}

export const setup = (prefixer?: (key: string, val: any) => string) => {
  return gooberSetup(null, prefixer);
};

const ThemeContext = createContext();

export function ThemeProvider<T extends Record<string, any>>(props: {
  theme: T;
  children?: JSX.Element;
}) {
  return createComponent(ThemeContext.Provider, {
    value: props.theme,
    get children() {
      return props.children;
    },
  });
}

export const useTheme = () => useContext(ThemeContext);

interface StyledProps {
  theme?: Record<string, any>;
  as?: keyof JSX.IntrinsicElements | Component<{ className?: string }>;
  className?: string;
  children?: JSX.Element;
}

type StyledIntrinsicProps<
  T extends keyof JSX.IntrinsicElements,
  P = {}
> = JSX.IntrinsicElements[T] & StyledProps & P;

type StyledComponentProps<C extends Component, P = {}> = ComponentProps<C> &
  StyledProps &
  P;

type StyledArgs<P> = Parameters<Tagged<P>>;

export function styled<T extends keyof JSX.IntrinsicElements>(
  tag: T
): <P extends unknown>(
  ...args: StyledArgs<StyledIntrinsicProps<T, P>>
) => (props: StyledIntrinsicProps<T, P>) => JSX.Element;

export function styled<T extends Component<{ className?: string }>>(
  tag: T
): <P extends unknown>(
  ...args: StyledArgs<StyledComponentProps<T, P>>
) => (props: StyledComponentProps<T, P>) => JSX.Element;

export function styled(
  tag: keyof JSX.IntrinsicElements | Component<{ className?: string }>
) {
  return (...args: StyledArgs<StyledProps>) =>
    function Styled(props: StyledProps) {
      const theme = useTheme();
      const clone = mergeProps(props, {
        get className(): string {
          const pClassName = props.className,
            append = !!pClassName && /^go[0-9]+/.test(pClassName);
          // Call `css` with the append flag and pass the props
          // TODO: Remove args type cast when goober fixes to include function args
          let className = css.apply({ o: append, p: clone }, args as any);
          return [pClassName, className].filter(Boolean).join(" ");
        },
        theme,
      });

      const [local, newProps] = splitProps(clone, ["as"]);
      const createTag = local.as || tag;

      if (typeof createTag === "function") {
        return createTag(newProps);
      }

      if (isServer) {
        const [local, rest] = splitProps(newProps, ["children"]);
        return ssr(
          [`<${createTag} `, ">", `</${createTag}>`],
          ssrSpread(rest),
          local.children || ""
        );
      }

      const el = document.createElement(createTag);
      spread(el, newProps);
      return el;
    };
}
