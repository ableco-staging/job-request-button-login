export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type AwaitReturnType<
  F extends (...args: Array<unknown>) => PromiseLike<unknown>,
> = Await<ReturnType<F>>;

export type UnwrapArrayType<ArrayT> = ArrayT extends Array<infer T> ? T : any;
