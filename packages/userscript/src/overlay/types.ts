import { Square } from '../types'

export interface OverlayOptions {
  debug?: boolean
}

export interface SquareOverlay {
  square: Square
  content: string
  className: string
}

export interface SquarePosition {
  top: string
  left: string
}
