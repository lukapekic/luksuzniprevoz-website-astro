type Axis = Record<string, string>;
type Axes = Record<string, Axis>;

export type VariantSelection<A extends Axes> = {
  [K in keyof A]?: keyof A[K] & string;
};

export type VariantProps<T> = T extends { __axes: infer A extends Axes }
  ? VariantSelection<A>
  : never;

export function variants<const A extends Axes>(config: {
  base?: string;
  axes: A;
  defaults: { [K in keyof A]: keyof A[K] & string };
}) {
  const fn = (selection: VariantSelection<A> = {}, layoutClass?: string): string => {
    const picked = (Object.keys(config.axes) as (keyof A)[]).map((axis) => {
      const axisObj = config.axes[axis]!;
      const chosen = selection[axis] ?? config.defaults[axis];
      return axisObj[chosen as string]!;
    });
    return [config.base, ...picked, layoutClass].filter(Boolean).join(" ");
  };
  return fn as typeof fn & { __axes: A };
}

export function allCombinations<A extends Axes>(axes: A): VariantSelection<A>[] {
  const keys = Object.keys(axes) as (keyof A)[];
  if (keys.length === 0) return [{}];
  const first = keys[0]!;
  const rest = keys.slice(1);
  const restAxes = rest.reduce<Record<string, Axis>>((acc, k) => {
    const v = axes[k];
    if (v !== undefined) acc[k as string] = v;
    return acc;
  }, {});
  const subCombos = allCombinations(restAxes as Omit<A, typeof first>);
  const result: VariantSelection<A>[] = [];
  for (const key of Object.keys(axes[first]!)) {
    for (const sub of subCombos) {
      result.push({ ...sub, [first]: key });
    }
  }
  return result;
}
