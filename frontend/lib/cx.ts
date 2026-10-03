/** Joins truthy class names: cx("btn", isActive && "active") */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
