export interface WebAnnotation {
  id: string;

  body: Object | Array<Object>;

  target: AnnotationTarget | Array<AnnotationTarget>;

  [key: string]: any
}

export interface AnnotationBody {
  type?: string;

  purpose?: string;

  value?: string;

  created?: Date;

  creator?: {
    id: string;

    name?: string;
  };
}

export interface AnnotationTarget {
  source: string;

  selector: Selector | Array<Selector>;
}

export interface Selector {
  type: string;

  conformsTo?: string;

  value: string;
}
