import { ComponentProps } from '../utils'
export type { Theme } from '../theme'

export enum BlockVariant {
  flat,
  shadow,
}
export type BlockVariants = keyof typeof BlockVariant

export enum BlockColor {
  foreground,
  background,
  accent,
}
export type BlockColors = keyof typeof BlockColor

export type BlockProps = ComponentProps<
  'div',
  {
    color?: BlockColors
    variant?: BlockVariants
    paddingLess?: boolean
  }
>
