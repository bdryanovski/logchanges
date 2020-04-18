interface IObject {
    [key: string]: any;
}
declare type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare const merge: <T extends IObject[]>(...objects: T) => TUnionToIntersection<T[number]>;
export default merge;
