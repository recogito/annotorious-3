import type { WebAnnotation } from "@annotorious/formats"

export interface APIEvents {

  createAnnotation: (annotation: WebAnnotation) => void

  deleteAnnotation: (annotation: WebAnnotation) => void 

  mouseEnterAnnotation: (annotation: WebAnnotation) => void

  mouseLeaveAnnotation: (annotation: WebAnnotation) => void

  selectAnnotation: (annotation: WebAnnotation) => void

  updateAnnotation: (annotation: WebAnnotation, previous: WebAnnotation) => void
  
}
