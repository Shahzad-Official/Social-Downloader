export interface YoutubeModel {
  success: boolean
  message: string
  title: string
  data: Daum[]|any
}

export interface Daum {
  itag: number
  mimeType: string
  bitrate: number
  width?: number
  height?: number
  initRange: InitRange
  indexRange: IndexRange
  lastModified: string
  contentLength: string
  quality: string
  fps?: number
  qualityLabel?: string
  projectionType: string
  averageBitrate: number
  approxDurationMs: string
  url: string
  colorInfo?: ColorInfo
  highReplication?: boolean
  audioQuality?: string
  audioSampleRate?: string
  audioChannels?: number
  loudnessDb?: number
}

export interface InitRange {
  start: string
  end: string
}

export interface IndexRange {
  start: string
  end: string
}

export interface ColorInfo {
  primaries: string
  transferCharacteristics: string
  matrixCoefficients: string
}
