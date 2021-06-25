import { deepEqual } from "fast-equals"

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function unique<T extends Record<string, any>>(array: T[]) {
  return array.filter((elm2, index) => array.findIndex((elm1) => deepEqual(elm1, elm2)) === index)
}
