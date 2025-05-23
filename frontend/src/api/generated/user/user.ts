/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Auth API
 * Simple email/password authentication API using JWT in HTTP-only cookies.
 * OpenAPI spec version: 1.0.0
 */
import type { User } from ".././model";
import { customInstance } from "../../mutator/custom-instance";

export const getUser = () => {
  /**
   * @summary Get current authenticated user
   */
  const me = () => {
    return customInstance<User>({ url: `/api/me`, method: "GET" });
  };
  return { me };
};
export type MeResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUser>["me"]>>
>;
