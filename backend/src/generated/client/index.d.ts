
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ProfilePreference
 * 
 */
export type ProfilePreference = $Result.DefaultSelection<Prisma.$ProfilePreferencePayload>
/**
 * Model DailyCheckIn
 * 
 */
export type DailyCheckIn = $Result.DefaultSelection<Prisma.$DailyCheckInPayload>
/**
 * Model Recommendation
 * 
 */
export type Recommendation = $Result.DefaultSelection<Prisma.$RecommendationPayload>
/**
 * Model Streak
 * 
 */
export type Streak = $Result.DefaultSelection<Prisma.$StreakPayload>
/**
 * Model Badge
 * 
 */
export type Badge = $Result.DefaultSelection<Prisma.$BadgePayload>
/**
 * Model UserBadge
 * 
 */
export type UserBadge = $Result.DefaultSelection<Prisma.$UserBadgePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profilePreference`: Exposes CRUD operations for the **ProfilePreference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfilePreferences
    * const profilePreferences = await prisma.profilePreference.findMany()
    * ```
    */
  get profilePreference(): Prisma.ProfilePreferenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyCheckIn`: Exposes CRUD operations for the **DailyCheckIn** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyCheckIns
    * const dailyCheckIns = await prisma.dailyCheckIn.findMany()
    * ```
    */
  get dailyCheckIn(): Prisma.DailyCheckInDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recommendation`: Exposes CRUD operations for the **Recommendation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recommendations
    * const recommendations = await prisma.recommendation.findMany()
    * ```
    */
  get recommendation(): Prisma.RecommendationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.streak`: Exposes CRUD operations for the **Streak** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Streaks
    * const streaks = await prisma.streak.findMany()
    * ```
    */
  get streak(): Prisma.StreakDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.badge`: Exposes CRUD operations for the **Badge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Badges
    * const badges = await prisma.badge.findMany()
    * ```
    */
  get badge(): Prisma.BadgeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userBadge`: Exposes CRUD operations for the **UserBadge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserBadges
    * const userBadges = await prisma.userBadge.findMany()
    * ```
    */
  get userBadge(): Prisma.UserBadgeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    ProfilePreference: 'ProfilePreference',
    DailyCheckIn: 'DailyCheckIn',
    Recommendation: 'Recommendation',
    Streak: 'Streak',
    Badge: 'Badge',
    UserBadge: 'UserBadge'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "profilePreference" | "dailyCheckIn" | "recommendation" | "streak" | "badge" | "userBadge"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ProfilePreference: {
        payload: Prisma.$ProfilePreferencePayload<ExtArgs>
        fields: Prisma.ProfilePreferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfilePreferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfilePreferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          findFirst: {
            args: Prisma.ProfilePreferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfilePreferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          findMany: {
            args: Prisma.ProfilePreferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>[]
          }
          create: {
            args: Prisma.ProfilePreferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          createMany: {
            args: Prisma.ProfilePreferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfilePreferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>[]
          }
          delete: {
            args: Prisma.ProfilePreferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          update: {
            args: Prisma.ProfilePreferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          deleteMany: {
            args: Prisma.ProfilePreferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfilePreferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfilePreferenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>[]
          }
          upsert: {
            args: Prisma.ProfilePreferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePreferencePayload>
          }
          aggregate: {
            args: Prisma.ProfilePreferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfilePreference>
          }
          groupBy: {
            args: Prisma.ProfilePreferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfilePreferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfilePreferenceCountArgs<ExtArgs>
            result: $Utils.Optional<ProfilePreferenceCountAggregateOutputType> | number
          }
        }
      }
      DailyCheckIn: {
        payload: Prisma.$DailyCheckInPayload<ExtArgs>
        fields: Prisma.DailyCheckInFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyCheckInFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyCheckInFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          findFirst: {
            args: Prisma.DailyCheckInFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyCheckInFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          findMany: {
            args: Prisma.DailyCheckInFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>[]
          }
          create: {
            args: Prisma.DailyCheckInCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          createMany: {
            args: Prisma.DailyCheckInCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyCheckInCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>[]
          }
          delete: {
            args: Prisma.DailyCheckInDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          update: {
            args: Prisma.DailyCheckInUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          deleteMany: {
            args: Prisma.DailyCheckInDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyCheckInUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyCheckInUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>[]
          }
          upsert: {
            args: Prisma.DailyCheckInUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckInPayload>
          }
          aggregate: {
            args: Prisma.DailyCheckInAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyCheckIn>
          }
          groupBy: {
            args: Prisma.DailyCheckInGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyCheckInGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyCheckInCountArgs<ExtArgs>
            result: $Utils.Optional<DailyCheckInCountAggregateOutputType> | number
          }
        }
      }
      Recommendation: {
        payload: Prisma.$RecommendationPayload<ExtArgs>
        fields: Prisma.RecommendationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecommendationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecommendationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          findFirst: {
            args: Prisma.RecommendationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecommendationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          findMany: {
            args: Prisma.RecommendationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>[]
          }
          create: {
            args: Prisma.RecommendationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          createMany: {
            args: Prisma.RecommendationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecommendationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>[]
          }
          delete: {
            args: Prisma.RecommendationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          update: {
            args: Prisma.RecommendationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          deleteMany: {
            args: Prisma.RecommendationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecommendationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecommendationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>[]
          }
          upsert: {
            args: Prisma.RecommendationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          aggregate: {
            args: Prisma.RecommendationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecommendation>
          }
          groupBy: {
            args: Prisma.RecommendationGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecommendationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecommendationCountArgs<ExtArgs>
            result: $Utils.Optional<RecommendationCountAggregateOutputType> | number
          }
        }
      }
      Streak: {
        payload: Prisma.$StreakPayload<ExtArgs>
        fields: Prisma.StreakFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StreakFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StreakFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          findFirst: {
            args: Prisma.StreakFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StreakFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          findMany: {
            args: Prisma.StreakFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>[]
          }
          create: {
            args: Prisma.StreakCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          createMany: {
            args: Prisma.StreakCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StreakCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>[]
          }
          delete: {
            args: Prisma.StreakDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          update: {
            args: Prisma.StreakUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          deleteMany: {
            args: Prisma.StreakDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StreakUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StreakUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>[]
          }
          upsert: {
            args: Prisma.StreakUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StreakPayload>
          }
          aggregate: {
            args: Prisma.StreakAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStreak>
          }
          groupBy: {
            args: Prisma.StreakGroupByArgs<ExtArgs>
            result: $Utils.Optional<StreakGroupByOutputType>[]
          }
          count: {
            args: Prisma.StreakCountArgs<ExtArgs>
            result: $Utils.Optional<StreakCountAggregateOutputType> | number
          }
        }
      }
      Badge: {
        payload: Prisma.$BadgePayload<ExtArgs>
        fields: Prisma.BadgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BadgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BadgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          findFirst: {
            args: Prisma.BadgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BadgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          findMany: {
            args: Prisma.BadgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          create: {
            args: Prisma.BadgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          createMany: {
            args: Prisma.BadgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BadgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          delete: {
            args: Prisma.BadgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          update: {
            args: Prisma.BadgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          deleteMany: {
            args: Prisma.BadgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BadgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BadgeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          upsert: {
            args: Prisma.BadgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          aggregate: {
            args: Prisma.BadgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBadge>
          }
          groupBy: {
            args: Prisma.BadgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BadgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BadgeCountArgs<ExtArgs>
            result: $Utils.Optional<BadgeCountAggregateOutputType> | number
          }
        }
      }
      UserBadge: {
        payload: Prisma.$UserBadgePayload<ExtArgs>
        fields: Prisma.UserBadgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserBadgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserBadgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          findFirst: {
            args: Prisma.UserBadgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserBadgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          findMany: {
            args: Prisma.UserBadgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          create: {
            args: Prisma.UserBadgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          createMany: {
            args: Prisma.UserBadgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserBadgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          delete: {
            args: Prisma.UserBadgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          update: {
            args: Prisma.UserBadgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          deleteMany: {
            args: Prisma.UserBadgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserBadgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserBadgeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          upsert: {
            args: Prisma.UserBadgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          aggregate: {
            args: Prisma.UserBadgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserBadge>
          }
          groupBy: {
            args: Prisma.UserBadgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserBadgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserBadgeCountArgs<ExtArgs>
            result: $Utils.Optional<UserBadgeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    profilePreference?: ProfilePreferenceOmit
    dailyCheckIn?: DailyCheckInOmit
    recommendation?: RecommendationOmit
    streak?: StreakOmit
    badge?: BadgeOmit
    userBadge?: UserBadgeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    dailyCheckIns: number
    recommendations: number
    userBadges: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dailyCheckIns?: boolean | UserCountOutputTypeCountDailyCheckInsArgs
    recommendations?: boolean | UserCountOutputTypeCountRecommendationsArgs
    userBadges?: boolean | UserCountOutputTypeCountUserBadgesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDailyCheckInsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyCheckInWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserBadgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
  }


  /**
   * Count Type DailyCheckInCountOutputType
   */

  export type DailyCheckInCountOutputType = {
    recommendations: number
  }

  export type DailyCheckInCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recommendations?: boolean | DailyCheckInCountOutputTypeCountRecommendationsArgs
  }

  // Custom InputTypes
  /**
   * DailyCheckInCountOutputType without action
   */
  export type DailyCheckInCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckInCountOutputType
     */
    select?: DailyCheckInCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DailyCheckInCountOutputType without action
   */
  export type DailyCheckInCountOutputTypeCountRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationWhereInput
  }


  /**
   * Count Type BadgeCountOutputType
   */

  export type BadgeCountOutputType = {
    userBadges: number
  }

  export type BadgeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userBadges?: boolean | BadgeCountOutputTypeCountUserBadgesArgs
  }

  // Custom InputTypes
  /**
   * BadgeCountOutputType without action
   */
  export type BadgeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeCountOutputType
     */
    select?: BadgeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BadgeCountOutputType without action
   */
  export type BadgeCountOutputTypeCountUserBadgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    age: number | null
    height: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    age: number | null
    height: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    passwordHash: string | null
    displayName: string | null
    gender: string | null
    age: number | null
    height: number | null
    origin: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    passwordHash: string | null
    displayName: string | null
    gender: string | null
    age: number | null
    height: number | null
    origin: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    displayName: number
    gender: number
    age: number
    height: number
    origin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    age?: true
    height?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    age?: true
    height?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    displayName?: true
    gender?: true
    age?: true
    height?: true
    origin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    displayName?: true
    gender?: true
    age?: true
    height?: true
    origin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    displayName?: true
    gender?: true
    age?: true
    height?: true
    origin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height: number | null
    origin: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    gender?: boolean
    age?: boolean
    height?: boolean
    origin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profilePreferences?: boolean | User$profilePreferencesArgs<ExtArgs>
    dailyCheckIns?: boolean | User$dailyCheckInsArgs<ExtArgs>
    recommendations?: boolean | User$recommendationsArgs<ExtArgs>
    streak?: boolean | User$streakArgs<ExtArgs>
    userBadges?: boolean | User$userBadgesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    gender?: boolean
    age?: boolean
    height?: boolean
    origin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    gender?: boolean
    age?: boolean
    height?: boolean
    origin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    gender?: boolean
    age?: boolean
    height?: boolean
    origin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "displayName" | "gender" | "age" | "height" | "origin" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profilePreferences?: boolean | User$profilePreferencesArgs<ExtArgs>
    dailyCheckIns?: boolean | User$dailyCheckInsArgs<ExtArgs>
    recommendations?: boolean | User$recommendationsArgs<ExtArgs>
    streak?: boolean | User$streakArgs<ExtArgs>
    userBadges?: boolean | User$userBadgesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      profilePreferences: Prisma.$ProfilePreferencePayload<ExtArgs> | null
      dailyCheckIns: Prisma.$DailyCheckInPayload<ExtArgs>[]
      recommendations: Prisma.$RecommendationPayload<ExtArgs>[]
      streak: Prisma.$StreakPayload<ExtArgs> | null
      userBadges: Prisma.$UserBadgePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      passwordHash: string
      displayName: string
      gender: string
      age: number
      height: number | null
      origin: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profilePreferences<T extends User$profilePreferencesArgs<ExtArgs> = {}>(args?: Subset<T, User$profilePreferencesArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    dailyCheckIns<T extends User$dailyCheckInsArgs<ExtArgs> = {}>(args?: Subset<T, User$dailyCheckInsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    recommendations<T extends User$recommendationsArgs<ExtArgs> = {}>(args?: Subset<T, User$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    streak<T extends User$streakArgs<ExtArgs> = {}>(args?: Subset<T, User$streakArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    userBadges<T extends User$userBadgesArgs<ExtArgs> = {}>(args?: Subset<T, User$userBadgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly gender: FieldRef<"User", 'String'>
    readonly age: FieldRef<"User", 'Int'>
    readonly height: FieldRef<"User", 'Int'>
    readonly origin: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.profilePreferences
   */
  export type User$profilePreferencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    where?: ProfilePreferenceWhereInput
  }

  /**
   * User.dailyCheckIns
   */
  export type User$dailyCheckInsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    where?: DailyCheckInWhereInput
    orderBy?: DailyCheckInOrderByWithRelationInput | DailyCheckInOrderByWithRelationInput[]
    cursor?: DailyCheckInWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyCheckInScalarFieldEnum | DailyCheckInScalarFieldEnum[]
  }

  /**
   * User.recommendations
   */
  export type User$recommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    where?: RecommendationWhereInput
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    cursor?: RecommendationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * User.streak
   */
  export type User$streakArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    where?: StreakWhereInput
  }

  /**
   * User.userBadges
   */
  export type User$userBadgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    cursor?: UserBadgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ProfilePreference
   */

  export type AggregateProfilePreference = {
    _count: ProfilePreferenceCountAggregateOutputType | null
    _avg: ProfilePreferenceAvgAggregateOutputType | null
    _sum: ProfilePreferenceSumAggregateOutputType | null
    _min: ProfilePreferenceMinAggregateOutputType | null
    _max: ProfilePreferenceMaxAggregateOutputType | null
  }

  export type ProfilePreferenceAvgAggregateOutputType = {
    userId: number | null
  }

  export type ProfilePreferenceSumAggregateOutputType = {
    userId: number | null
  }

  export type ProfilePreferenceMinAggregateOutputType = {
    userId: number | null
    updatedAt: Date | null
  }

  export type ProfilePreferenceMaxAggregateOutputType = {
    userId: number | null
    updatedAt: Date | null
  }

  export type ProfilePreferenceCountAggregateOutputType = {
    userId: number
    styleTags: number
    colorPreferences: number
    musicPreferences: number
    updatedAt: number
    _all: number
  }


  export type ProfilePreferenceAvgAggregateInputType = {
    userId?: true
  }

  export type ProfilePreferenceSumAggregateInputType = {
    userId?: true
  }

  export type ProfilePreferenceMinAggregateInputType = {
    userId?: true
    updatedAt?: true
  }

  export type ProfilePreferenceMaxAggregateInputType = {
    userId?: true
    updatedAt?: true
  }

  export type ProfilePreferenceCountAggregateInputType = {
    userId?: true
    styleTags?: true
    colorPreferences?: true
    musicPreferences?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfilePreferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfilePreference to aggregate.
     */
    where?: ProfilePreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePreferences to fetch.
     */
    orderBy?: ProfilePreferenceOrderByWithRelationInput | ProfilePreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfilePreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfilePreferences
    **/
    _count?: true | ProfilePreferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfilePreferenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfilePreferenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfilePreferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfilePreferenceMaxAggregateInputType
  }

  export type GetProfilePreferenceAggregateType<T extends ProfilePreferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateProfilePreference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfilePreference[P]>
      : GetScalarType<T[P], AggregateProfilePreference[P]>
  }




  export type ProfilePreferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfilePreferenceWhereInput
    orderBy?: ProfilePreferenceOrderByWithAggregationInput | ProfilePreferenceOrderByWithAggregationInput[]
    by: ProfilePreferenceScalarFieldEnum[] | ProfilePreferenceScalarFieldEnum
    having?: ProfilePreferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfilePreferenceCountAggregateInputType | true
    _avg?: ProfilePreferenceAvgAggregateInputType
    _sum?: ProfilePreferenceSumAggregateInputType
    _min?: ProfilePreferenceMinAggregateInputType
    _max?: ProfilePreferenceMaxAggregateInputType
  }

  export type ProfilePreferenceGroupByOutputType = {
    userId: number
    styleTags: JsonValue
    colorPreferences: JsonValue
    musicPreferences: JsonValue
    updatedAt: Date
    _count: ProfilePreferenceCountAggregateOutputType | null
    _avg: ProfilePreferenceAvgAggregateOutputType | null
    _sum: ProfilePreferenceSumAggregateOutputType | null
    _min: ProfilePreferenceMinAggregateOutputType | null
    _max: ProfilePreferenceMaxAggregateOutputType | null
  }

  type GetProfilePreferenceGroupByPayload<T extends ProfilePreferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfilePreferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfilePreferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfilePreferenceGroupByOutputType[P]>
            : GetScalarType<T[P], ProfilePreferenceGroupByOutputType[P]>
        }
      >
    >


  export type ProfilePreferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    styleTags?: boolean
    colorPreferences?: boolean
    musicPreferences?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePreference"]>

  export type ProfilePreferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    styleTags?: boolean
    colorPreferences?: boolean
    musicPreferences?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePreference"]>

  export type ProfilePreferenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    styleTags?: boolean
    colorPreferences?: boolean
    musicPreferences?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePreference"]>

  export type ProfilePreferenceSelectScalar = {
    userId?: boolean
    styleTags?: boolean
    colorPreferences?: boolean
    musicPreferences?: boolean
    updatedAt?: boolean
  }

  export type ProfilePreferenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "styleTags" | "colorPreferences" | "musicPreferences" | "updatedAt", ExtArgs["result"]["profilePreference"]>
  export type ProfilePreferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProfilePreferenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProfilePreferenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProfilePreferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfilePreference"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      styleTags: Prisma.JsonValue
      colorPreferences: Prisma.JsonValue
      musicPreferences: Prisma.JsonValue
      updatedAt: Date
    }, ExtArgs["result"]["profilePreference"]>
    composites: {}
  }

  type ProfilePreferenceGetPayload<S extends boolean | null | undefined | ProfilePreferenceDefaultArgs> = $Result.GetResult<Prisma.$ProfilePreferencePayload, S>

  type ProfilePreferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfilePreferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfilePreferenceCountAggregateInputType | true
    }

  export interface ProfilePreferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfilePreference'], meta: { name: 'ProfilePreference' } }
    /**
     * Find zero or one ProfilePreference that matches the filter.
     * @param {ProfilePreferenceFindUniqueArgs} args - Arguments to find a ProfilePreference
     * @example
     * // Get one ProfilePreference
     * const profilePreference = await prisma.profilePreference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfilePreferenceFindUniqueArgs>(args: SelectSubset<T, ProfilePreferenceFindUniqueArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProfilePreference that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfilePreferenceFindUniqueOrThrowArgs} args - Arguments to find a ProfilePreference
     * @example
     * // Get one ProfilePreference
     * const profilePreference = await prisma.profilePreference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfilePreferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfilePreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfilePreference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceFindFirstArgs} args - Arguments to find a ProfilePreference
     * @example
     * // Get one ProfilePreference
     * const profilePreference = await prisma.profilePreference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfilePreferenceFindFirstArgs>(args?: SelectSubset<T, ProfilePreferenceFindFirstArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfilePreference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceFindFirstOrThrowArgs} args - Arguments to find a ProfilePreference
     * @example
     * // Get one ProfilePreference
     * const profilePreference = await prisma.profilePreference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfilePreferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfilePreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProfilePreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfilePreferences
     * const profilePreferences = await prisma.profilePreference.findMany()
     * 
     * // Get first 10 ProfilePreferences
     * const profilePreferences = await prisma.profilePreference.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const profilePreferenceWithUserIdOnly = await prisma.profilePreference.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends ProfilePreferenceFindManyArgs>(args?: SelectSubset<T, ProfilePreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProfilePreference.
     * @param {ProfilePreferenceCreateArgs} args - Arguments to create a ProfilePreference.
     * @example
     * // Create one ProfilePreference
     * const ProfilePreference = await prisma.profilePreference.create({
     *   data: {
     *     // ... data to create a ProfilePreference
     *   }
     * })
     * 
     */
    create<T extends ProfilePreferenceCreateArgs>(args: SelectSubset<T, ProfilePreferenceCreateArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProfilePreferences.
     * @param {ProfilePreferenceCreateManyArgs} args - Arguments to create many ProfilePreferences.
     * @example
     * // Create many ProfilePreferences
     * const profilePreference = await prisma.profilePreference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfilePreferenceCreateManyArgs>(args?: SelectSubset<T, ProfilePreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfilePreferences and returns the data saved in the database.
     * @param {ProfilePreferenceCreateManyAndReturnArgs} args - Arguments to create many ProfilePreferences.
     * @example
     * // Create many ProfilePreferences
     * const profilePreference = await prisma.profilePreference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfilePreferences and only return the `userId`
     * const profilePreferenceWithUserIdOnly = await prisma.profilePreference.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfilePreferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfilePreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProfilePreference.
     * @param {ProfilePreferenceDeleteArgs} args - Arguments to delete one ProfilePreference.
     * @example
     * // Delete one ProfilePreference
     * const ProfilePreference = await prisma.profilePreference.delete({
     *   where: {
     *     // ... filter to delete one ProfilePreference
     *   }
     * })
     * 
     */
    delete<T extends ProfilePreferenceDeleteArgs>(args: SelectSubset<T, ProfilePreferenceDeleteArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProfilePreference.
     * @param {ProfilePreferenceUpdateArgs} args - Arguments to update one ProfilePreference.
     * @example
     * // Update one ProfilePreference
     * const profilePreference = await prisma.profilePreference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfilePreferenceUpdateArgs>(args: SelectSubset<T, ProfilePreferenceUpdateArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProfilePreferences.
     * @param {ProfilePreferenceDeleteManyArgs} args - Arguments to filter ProfilePreferences to delete.
     * @example
     * // Delete a few ProfilePreferences
     * const { count } = await prisma.profilePreference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfilePreferenceDeleteManyArgs>(args?: SelectSubset<T, ProfilePreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfilePreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfilePreferences
     * const profilePreference = await prisma.profilePreference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfilePreferenceUpdateManyArgs>(args: SelectSubset<T, ProfilePreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfilePreferences and returns the data updated in the database.
     * @param {ProfilePreferenceUpdateManyAndReturnArgs} args - Arguments to update many ProfilePreferences.
     * @example
     * // Update many ProfilePreferences
     * const profilePreference = await prisma.profilePreference.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProfilePreferences and only return the `userId`
     * const profilePreferenceWithUserIdOnly = await prisma.profilePreference.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfilePreferenceUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfilePreferenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProfilePreference.
     * @param {ProfilePreferenceUpsertArgs} args - Arguments to update or create a ProfilePreference.
     * @example
     * // Update or create a ProfilePreference
     * const profilePreference = await prisma.profilePreference.upsert({
     *   create: {
     *     // ... data to create a ProfilePreference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfilePreference we want to update
     *   }
     * })
     */
    upsert<T extends ProfilePreferenceUpsertArgs>(args: SelectSubset<T, ProfilePreferenceUpsertArgs<ExtArgs>>): Prisma__ProfilePreferenceClient<$Result.GetResult<Prisma.$ProfilePreferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProfilePreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceCountArgs} args - Arguments to filter ProfilePreferences to count.
     * @example
     * // Count the number of ProfilePreferences
     * const count = await prisma.profilePreference.count({
     *   where: {
     *     // ... the filter for the ProfilePreferences we want to count
     *   }
     * })
    **/
    count<T extends ProfilePreferenceCountArgs>(
      args?: Subset<T, ProfilePreferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfilePreferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfilePreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfilePreferenceAggregateArgs>(args: Subset<T, ProfilePreferenceAggregateArgs>): Prisma.PrismaPromise<GetProfilePreferenceAggregateType<T>>

    /**
     * Group by ProfilePreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePreferenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfilePreferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfilePreferenceGroupByArgs['orderBy'] }
        : { orderBy?: ProfilePreferenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfilePreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfilePreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfilePreference model
   */
  readonly fields: ProfilePreferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfilePreference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfilePreferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProfilePreference model
   */
  interface ProfilePreferenceFieldRefs {
    readonly userId: FieldRef<"ProfilePreference", 'Int'>
    readonly styleTags: FieldRef<"ProfilePreference", 'Json'>
    readonly colorPreferences: FieldRef<"ProfilePreference", 'Json'>
    readonly musicPreferences: FieldRef<"ProfilePreference", 'Json'>
    readonly updatedAt: FieldRef<"ProfilePreference", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfilePreference findUnique
   */
  export type ProfilePreferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePreference to fetch.
     */
    where: ProfilePreferenceWhereUniqueInput
  }

  /**
   * ProfilePreference findUniqueOrThrow
   */
  export type ProfilePreferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePreference to fetch.
     */
    where: ProfilePreferenceWhereUniqueInput
  }

  /**
   * ProfilePreference findFirst
   */
  export type ProfilePreferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePreference to fetch.
     */
    where?: ProfilePreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePreferences to fetch.
     */
    orderBy?: ProfilePreferenceOrderByWithRelationInput | ProfilePreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfilePreferences.
     */
    cursor?: ProfilePreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfilePreferences.
     */
    distinct?: ProfilePreferenceScalarFieldEnum | ProfilePreferenceScalarFieldEnum[]
  }

  /**
   * ProfilePreference findFirstOrThrow
   */
  export type ProfilePreferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePreference to fetch.
     */
    where?: ProfilePreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePreferences to fetch.
     */
    orderBy?: ProfilePreferenceOrderByWithRelationInput | ProfilePreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfilePreferences.
     */
    cursor?: ProfilePreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfilePreferences.
     */
    distinct?: ProfilePreferenceScalarFieldEnum | ProfilePreferenceScalarFieldEnum[]
  }

  /**
   * ProfilePreference findMany
   */
  export type ProfilePreferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePreferences to fetch.
     */
    where?: ProfilePreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePreferences to fetch.
     */
    orderBy?: ProfilePreferenceOrderByWithRelationInput | ProfilePreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfilePreferences.
     */
    cursor?: ProfilePreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfilePreferences.
     */
    distinct?: ProfilePreferenceScalarFieldEnum | ProfilePreferenceScalarFieldEnum[]
  }

  /**
   * ProfilePreference create
   */
  export type ProfilePreferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfilePreference.
     */
    data: XOR<ProfilePreferenceCreateInput, ProfilePreferenceUncheckedCreateInput>
  }

  /**
   * ProfilePreference createMany
   */
  export type ProfilePreferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfilePreferences.
     */
    data: ProfilePreferenceCreateManyInput | ProfilePreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfilePreference createManyAndReturn
   */
  export type ProfilePreferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * The data used to create many ProfilePreferences.
     */
    data: ProfilePreferenceCreateManyInput | ProfilePreferenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfilePreference update
   */
  export type ProfilePreferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfilePreference.
     */
    data: XOR<ProfilePreferenceUpdateInput, ProfilePreferenceUncheckedUpdateInput>
    /**
     * Choose, which ProfilePreference to update.
     */
    where: ProfilePreferenceWhereUniqueInput
  }

  /**
   * ProfilePreference updateMany
   */
  export type ProfilePreferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfilePreferences.
     */
    data: XOR<ProfilePreferenceUpdateManyMutationInput, ProfilePreferenceUncheckedUpdateManyInput>
    /**
     * Filter which ProfilePreferences to update
     */
    where?: ProfilePreferenceWhereInput
    /**
     * Limit how many ProfilePreferences to update.
     */
    limit?: number
  }

  /**
   * ProfilePreference updateManyAndReturn
   */
  export type ProfilePreferenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * The data used to update ProfilePreferences.
     */
    data: XOR<ProfilePreferenceUpdateManyMutationInput, ProfilePreferenceUncheckedUpdateManyInput>
    /**
     * Filter which ProfilePreferences to update
     */
    where?: ProfilePreferenceWhereInput
    /**
     * Limit how many ProfilePreferences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfilePreference upsert
   */
  export type ProfilePreferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfilePreference to update in case it exists.
     */
    where: ProfilePreferenceWhereUniqueInput
    /**
     * In case the ProfilePreference found by the `where` argument doesn't exist, create a new ProfilePreference with this data.
     */
    create: XOR<ProfilePreferenceCreateInput, ProfilePreferenceUncheckedCreateInput>
    /**
     * In case the ProfilePreference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfilePreferenceUpdateInput, ProfilePreferenceUncheckedUpdateInput>
  }

  /**
   * ProfilePreference delete
   */
  export type ProfilePreferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
    /**
     * Filter which ProfilePreference to delete.
     */
    where: ProfilePreferenceWhereUniqueInput
  }

  /**
   * ProfilePreference deleteMany
   */
  export type ProfilePreferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfilePreferences to delete
     */
    where?: ProfilePreferenceWhereInput
    /**
     * Limit how many ProfilePreferences to delete.
     */
    limit?: number
  }

  /**
   * ProfilePreference without action
   */
  export type ProfilePreferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePreference
     */
    select?: ProfilePreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePreference
     */
    omit?: ProfilePreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePreferenceInclude<ExtArgs> | null
  }


  /**
   * Model DailyCheckIn
   */

  export type AggregateDailyCheckIn = {
    _count: DailyCheckInCountAggregateOutputType | null
    _avg: DailyCheckInAvgAggregateOutputType | null
    _sum: DailyCheckInSumAggregateOutputType | null
    _min: DailyCheckInMinAggregateOutputType | null
    _max: DailyCheckInMaxAggregateOutputType | null
  }

  export type DailyCheckInAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type DailyCheckInSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type DailyCheckInMinAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinDate: Date | null
    moodDetected: string | null
    moodSelected: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type DailyCheckInMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinDate: Date | null
    moodDetected: string | null
    moodSelected: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type DailyCheckInCountAggregateOutputType = {
    id: number
    userId: number
    checkinDate: number
    moodDetected: number
    moodSelected: number
    answers: number
    imageUrl: number
    createdAt: number
    _all: number
  }


  export type DailyCheckInAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type DailyCheckInSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type DailyCheckInMinAggregateInputType = {
    id?: true
    userId?: true
    checkinDate?: true
    moodDetected?: true
    moodSelected?: true
    imageUrl?: true
    createdAt?: true
  }

  export type DailyCheckInMaxAggregateInputType = {
    id?: true
    userId?: true
    checkinDate?: true
    moodDetected?: true
    moodSelected?: true
    imageUrl?: true
    createdAt?: true
  }

  export type DailyCheckInCountAggregateInputType = {
    id?: true
    userId?: true
    checkinDate?: true
    moodDetected?: true
    moodSelected?: true
    answers?: true
    imageUrl?: true
    createdAt?: true
    _all?: true
  }

  export type DailyCheckInAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyCheckIn to aggregate.
     */
    where?: DailyCheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckIns to fetch.
     */
    orderBy?: DailyCheckInOrderByWithRelationInput | DailyCheckInOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyCheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyCheckIns
    **/
    _count?: true | DailyCheckInCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyCheckInAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyCheckInSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyCheckInMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyCheckInMaxAggregateInputType
  }

  export type GetDailyCheckInAggregateType<T extends DailyCheckInAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyCheckIn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyCheckIn[P]>
      : GetScalarType<T[P], AggregateDailyCheckIn[P]>
  }




  export type DailyCheckInGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyCheckInWhereInput
    orderBy?: DailyCheckInOrderByWithAggregationInput | DailyCheckInOrderByWithAggregationInput[]
    by: DailyCheckInScalarFieldEnum[] | DailyCheckInScalarFieldEnum
    having?: DailyCheckInScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyCheckInCountAggregateInputType | true
    _avg?: DailyCheckInAvgAggregateInputType
    _sum?: DailyCheckInSumAggregateInputType
    _min?: DailyCheckInMinAggregateInputType
    _max?: DailyCheckInMaxAggregateInputType
  }

  export type DailyCheckInGroupByOutputType = {
    id: number
    userId: number
    checkinDate: Date
    moodDetected: string
    moodSelected: string
    answers: JsonValue
    imageUrl: string | null
    createdAt: Date
    _count: DailyCheckInCountAggregateOutputType | null
    _avg: DailyCheckInAvgAggregateOutputType | null
    _sum: DailyCheckInSumAggregateOutputType | null
    _min: DailyCheckInMinAggregateOutputType | null
    _max: DailyCheckInMaxAggregateOutputType | null
  }

  type GetDailyCheckInGroupByPayload<T extends DailyCheckInGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyCheckInGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyCheckInGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyCheckInGroupByOutputType[P]>
            : GetScalarType<T[P], DailyCheckInGroupByOutputType[P]>
        }
      >
    >


  export type DailyCheckInSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinDate?: boolean
    moodDetected?: boolean
    moodSelected?: boolean
    answers?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    recommendations?: boolean | DailyCheckIn$recommendationsArgs<ExtArgs>
    _count?: boolean | DailyCheckInCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckIn"]>

  export type DailyCheckInSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinDate?: boolean
    moodDetected?: boolean
    moodSelected?: boolean
    answers?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckIn"]>

  export type DailyCheckInSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinDate?: boolean
    moodDetected?: boolean
    moodSelected?: boolean
    answers?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckIn"]>

  export type DailyCheckInSelectScalar = {
    id?: boolean
    userId?: boolean
    checkinDate?: boolean
    moodDetected?: boolean
    moodSelected?: boolean
    answers?: boolean
    imageUrl?: boolean
    createdAt?: boolean
  }

  export type DailyCheckInOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "checkinDate" | "moodDetected" | "moodSelected" | "answers" | "imageUrl" | "createdAt", ExtArgs["result"]["dailyCheckIn"]>
  export type DailyCheckInInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    recommendations?: boolean | DailyCheckIn$recommendationsArgs<ExtArgs>
    _count?: boolean | DailyCheckInCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DailyCheckInIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyCheckInIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DailyCheckInPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyCheckIn"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      recommendations: Prisma.$RecommendationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      checkinDate: Date
      moodDetected: string
      moodSelected: string
      answers: Prisma.JsonValue
      imageUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["dailyCheckIn"]>
    composites: {}
  }

  type DailyCheckInGetPayload<S extends boolean | null | undefined | DailyCheckInDefaultArgs> = $Result.GetResult<Prisma.$DailyCheckInPayload, S>

  type DailyCheckInCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyCheckInFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyCheckInCountAggregateInputType | true
    }

  export interface DailyCheckInDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyCheckIn'], meta: { name: 'DailyCheckIn' } }
    /**
     * Find zero or one DailyCheckIn that matches the filter.
     * @param {DailyCheckInFindUniqueArgs} args - Arguments to find a DailyCheckIn
     * @example
     * // Get one DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyCheckInFindUniqueArgs>(args: SelectSubset<T, DailyCheckInFindUniqueArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyCheckIn that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyCheckInFindUniqueOrThrowArgs} args - Arguments to find a DailyCheckIn
     * @example
     * // Get one DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyCheckInFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyCheckInFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyCheckIn that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInFindFirstArgs} args - Arguments to find a DailyCheckIn
     * @example
     * // Get one DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyCheckInFindFirstArgs>(args?: SelectSubset<T, DailyCheckInFindFirstArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyCheckIn that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInFindFirstOrThrowArgs} args - Arguments to find a DailyCheckIn
     * @example
     * // Get one DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyCheckInFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyCheckInFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyCheckIns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyCheckIns
     * const dailyCheckIns = await prisma.dailyCheckIn.findMany()
     * 
     * // Get first 10 DailyCheckIns
     * const dailyCheckIns = await prisma.dailyCheckIn.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyCheckInWithIdOnly = await prisma.dailyCheckIn.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyCheckInFindManyArgs>(args?: SelectSubset<T, DailyCheckInFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyCheckIn.
     * @param {DailyCheckInCreateArgs} args - Arguments to create a DailyCheckIn.
     * @example
     * // Create one DailyCheckIn
     * const DailyCheckIn = await prisma.dailyCheckIn.create({
     *   data: {
     *     // ... data to create a DailyCheckIn
     *   }
     * })
     * 
     */
    create<T extends DailyCheckInCreateArgs>(args: SelectSubset<T, DailyCheckInCreateArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyCheckIns.
     * @param {DailyCheckInCreateManyArgs} args - Arguments to create many DailyCheckIns.
     * @example
     * // Create many DailyCheckIns
     * const dailyCheckIn = await prisma.dailyCheckIn.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyCheckInCreateManyArgs>(args?: SelectSubset<T, DailyCheckInCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyCheckIns and returns the data saved in the database.
     * @param {DailyCheckInCreateManyAndReturnArgs} args - Arguments to create many DailyCheckIns.
     * @example
     * // Create many DailyCheckIns
     * const dailyCheckIn = await prisma.dailyCheckIn.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyCheckIns and only return the `id`
     * const dailyCheckInWithIdOnly = await prisma.dailyCheckIn.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyCheckInCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyCheckInCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyCheckIn.
     * @param {DailyCheckInDeleteArgs} args - Arguments to delete one DailyCheckIn.
     * @example
     * // Delete one DailyCheckIn
     * const DailyCheckIn = await prisma.dailyCheckIn.delete({
     *   where: {
     *     // ... filter to delete one DailyCheckIn
     *   }
     * })
     * 
     */
    delete<T extends DailyCheckInDeleteArgs>(args: SelectSubset<T, DailyCheckInDeleteArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyCheckIn.
     * @param {DailyCheckInUpdateArgs} args - Arguments to update one DailyCheckIn.
     * @example
     * // Update one DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyCheckInUpdateArgs>(args: SelectSubset<T, DailyCheckInUpdateArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyCheckIns.
     * @param {DailyCheckInDeleteManyArgs} args - Arguments to filter DailyCheckIns to delete.
     * @example
     * // Delete a few DailyCheckIns
     * const { count } = await prisma.dailyCheckIn.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyCheckInDeleteManyArgs>(args?: SelectSubset<T, DailyCheckInDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyCheckIns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyCheckIns
     * const dailyCheckIn = await prisma.dailyCheckIn.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyCheckInUpdateManyArgs>(args: SelectSubset<T, DailyCheckInUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyCheckIns and returns the data updated in the database.
     * @param {DailyCheckInUpdateManyAndReturnArgs} args - Arguments to update many DailyCheckIns.
     * @example
     * // Update many DailyCheckIns
     * const dailyCheckIn = await prisma.dailyCheckIn.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyCheckIns and only return the `id`
     * const dailyCheckInWithIdOnly = await prisma.dailyCheckIn.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DailyCheckInUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyCheckInUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyCheckIn.
     * @param {DailyCheckInUpsertArgs} args - Arguments to update or create a DailyCheckIn.
     * @example
     * // Update or create a DailyCheckIn
     * const dailyCheckIn = await prisma.dailyCheckIn.upsert({
     *   create: {
     *     // ... data to create a DailyCheckIn
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyCheckIn we want to update
     *   }
     * })
     */
    upsert<T extends DailyCheckInUpsertArgs>(args: SelectSubset<T, DailyCheckInUpsertArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyCheckIns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInCountArgs} args - Arguments to filter DailyCheckIns to count.
     * @example
     * // Count the number of DailyCheckIns
     * const count = await prisma.dailyCheckIn.count({
     *   where: {
     *     // ... the filter for the DailyCheckIns we want to count
     *   }
     * })
    **/
    count<T extends DailyCheckInCountArgs>(
      args?: Subset<T, DailyCheckInCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyCheckInCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyCheckIn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyCheckInAggregateArgs>(args: Subset<T, DailyCheckInAggregateArgs>): Prisma.PrismaPromise<GetDailyCheckInAggregateType<T>>

    /**
     * Group by DailyCheckIn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckInGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyCheckInGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyCheckInGroupByArgs['orderBy'] }
        : { orderBy?: DailyCheckInGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyCheckInGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyCheckInGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyCheckIn model
   */
  readonly fields: DailyCheckInFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyCheckIn.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyCheckInClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    recommendations<T extends DailyCheckIn$recommendationsArgs<ExtArgs> = {}>(args?: Subset<T, DailyCheckIn$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyCheckIn model
   */
  interface DailyCheckInFieldRefs {
    readonly id: FieldRef<"DailyCheckIn", 'Int'>
    readonly userId: FieldRef<"DailyCheckIn", 'Int'>
    readonly checkinDate: FieldRef<"DailyCheckIn", 'DateTime'>
    readonly moodDetected: FieldRef<"DailyCheckIn", 'String'>
    readonly moodSelected: FieldRef<"DailyCheckIn", 'String'>
    readonly answers: FieldRef<"DailyCheckIn", 'Json'>
    readonly imageUrl: FieldRef<"DailyCheckIn", 'String'>
    readonly createdAt: FieldRef<"DailyCheckIn", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyCheckIn findUnique
   */
  export type DailyCheckInFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckIn to fetch.
     */
    where: DailyCheckInWhereUniqueInput
  }

  /**
   * DailyCheckIn findUniqueOrThrow
   */
  export type DailyCheckInFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckIn to fetch.
     */
    where: DailyCheckInWhereUniqueInput
  }

  /**
   * DailyCheckIn findFirst
   */
  export type DailyCheckInFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckIn to fetch.
     */
    where?: DailyCheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckIns to fetch.
     */
    orderBy?: DailyCheckInOrderByWithRelationInput | DailyCheckInOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyCheckIns.
     */
    cursor?: DailyCheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyCheckIns.
     */
    distinct?: DailyCheckInScalarFieldEnum | DailyCheckInScalarFieldEnum[]
  }

  /**
   * DailyCheckIn findFirstOrThrow
   */
  export type DailyCheckInFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckIn to fetch.
     */
    where?: DailyCheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckIns to fetch.
     */
    orderBy?: DailyCheckInOrderByWithRelationInput | DailyCheckInOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyCheckIns.
     */
    cursor?: DailyCheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyCheckIns.
     */
    distinct?: DailyCheckInScalarFieldEnum | DailyCheckInScalarFieldEnum[]
  }

  /**
   * DailyCheckIn findMany
   */
  export type DailyCheckInFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckIns to fetch.
     */
    where?: DailyCheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckIns to fetch.
     */
    orderBy?: DailyCheckInOrderByWithRelationInput | DailyCheckInOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyCheckIns.
     */
    cursor?: DailyCheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyCheckIns.
     */
    distinct?: DailyCheckInScalarFieldEnum | DailyCheckInScalarFieldEnum[]
  }

  /**
   * DailyCheckIn create
   */
  export type DailyCheckInCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyCheckIn.
     */
    data: XOR<DailyCheckInCreateInput, DailyCheckInUncheckedCreateInput>
  }

  /**
   * DailyCheckIn createMany
   */
  export type DailyCheckInCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyCheckIns.
     */
    data: DailyCheckInCreateManyInput | DailyCheckInCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyCheckIn createManyAndReturn
   */
  export type DailyCheckInCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * The data used to create many DailyCheckIns.
     */
    data: DailyCheckInCreateManyInput | DailyCheckInCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyCheckIn update
   */
  export type DailyCheckInUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyCheckIn.
     */
    data: XOR<DailyCheckInUpdateInput, DailyCheckInUncheckedUpdateInput>
    /**
     * Choose, which DailyCheckIn to update.
     */
    where: DailyCheckInWhereUniqueInput
  }

  /**
   * DailyCheckIn updateMany
   */
  export type DailyCheckInUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyCheckIns.
     */
    data: XOR<DailyCheckInUpdateManyMutationInput, DailyCheckInUncheckedUpdateManyInput>
    /**
     * Filter which DailyCheckIns to update
     */
    where?: DailyCheckInWhereInput
    /**
     * Limit how many DailyCheckIns to update.
     */
    limit?: number
  }

  /**
   * DailyCheckIn updateManyAndReturn
   */
  export type DailyCheckInUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * The data used to update DailyCheckIns.
     */
    data: XOR<DailyCheckInUpdateManyMutationInput, DailyCheckInUncheckedUpdateManyInput>
    /**
     * Filter which DailyCheckIns to update
     */
    where?: DailyCheckInWhereInput
    /**
     * Limit how many DailyCheckIns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyCheckIn upsert
   */
  export type DailyCheckInUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyCheckIn to update in case it exists.
     */
    where: DailyCheckInWhereUniqueInput
    /**
     * In case the DailyCheckIn found by the `where` argument doesn't exist, create a new DailyCheckIn with this data.
     */
    create: XOR<DailyCheckInCreateInput, DailyCheckInUncheckedCreateInput>
    /**
     * In case the DailyCheckIn was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyCheckInUpdateInput, DailyCheckInUncheckedUpdateInput>
  }

  /**
   * DailyCheckIn delete
   */
  export type DailyCheckInDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
    /**
     * Filter which DailyCheckIn to delete.
     */
    where: DailyCheckInWhereUniqueInput
  }

  /**
   * DailyCheckIn deleteMany
   */
  export type DailyCheckInDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyCheckIns to delete
     */
    where?: DailyCheckInWhereInput
    /**
     * Limit how many DailyCheckIns to delete.
     */
    limit?: number
  }

  /**
   * DailyCheckIn.recommendations
   */
  export type DailyCheckIn$recommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    where?: RecommendationWhereInput
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    cursor?: RecommendationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * DailyCheckIn without action
   */
  export type DailyCheckInDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckIn
     */
    select?: DailyCheckInSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckIn
     */
    omit?: DailyCheckInOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckInInclude<ExtArgs> | null
  }


  /**
   * Model Recommendation
   */

  export type AggregateRecommendation = {
    _count: RecommendationCountAggregateOutputType | null
    _avg: RecommendationAvgAggregateOutputType | null
    _sum: RecommendationSumAggregateOutputType | null
    _min: RecommendationMinAggregateOutputType | null
    _max: RecommendationMaxAggregateOutputType | null
  }

  export type RecommendationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinId: number | null
  }

  export type RecommendationSumAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinId: number | null
  }

  export type RecommendationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinId: number | null
    recommendationDate: Date | null
    feedbackPositive: boolean | null
    createdAt: Date | null
  }

  export type RecommendationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    checkinId: number | null
    recommendationDate: Date | null
    feedbackPositive: boolean | null
    createdAt: Date | null
  }

  export type RecommendationCountAggregateOutputType = {
    id: number
    userId: number
    checkinId: number
    recommendationDate: number
    outfits: number
    makeup: number
    music: number
    feedbackPositive: number
    createdAt: number
    _all: number
  }


  export type RecommendationAvgAggregateInputType = {
    id?: true
    userId?: true
    checkinId?: true
  }

  export type RecommendationSumAggregateInputType = {
    id?: true
    userId?: true
    checkinId?: true
  }

  export type RecommendationMinAggregateInputType = {
    id?: true
    userId?: true
    checkinId?: true
    recommendationDate?: true
    feedbackPositive?: true
    createdAt?: true
  }

  export type RecommendationMaxAggregateInputType = {
    id?: true
    userId?: true
    checkinId?: true
    recommendationDate?: true
    feedbackPositive?: true
    createdAt?: true
  }

  export type RecommendationCountAggregateInputType = {
    id?: true
    userId?: true
    checkinId?: true
    recommendationDate?: true
    outfits?: true
    makeup?: true
    music?: true
    feedbackPositive?: true
    createdAt?: true
    _all?: true
  }

  export type RecommendationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recommendation to aggregate.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recommendations
    **/
    _count?: true | RecommendationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecommendationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecommendationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecommendationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecommendationMaxAggregateInputType
  }

  export type GetRecommendationAggregateType<T extends RecommendationAggregateArgs> = {
        [P in keyof T & keyof AggregateRecommendation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecommendation[P]>
      : GetScalarType<T[P], AggregateRecommendation[P]>
  }




  export type RecommendationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationWhereInput
    orderBy?: RecommendationOrderByWithAggregationInput | RecommendationOrderByWithAggregationInput[]
    by: RecommendationScalarFieldEnum[] | RecommendationScalarFieldEnum
    having?: RecommendationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecommendationCountAggregateInputType | true
    _avg?: RecommendationAvgAggregateInputType
    _sum?: RecommendationSumAggregateInputType
    _min?: RecommendationMinAggregateInputType
    _max?: RecommendationMaxAggregateInputType
  }

  export type RecommendationGroupByOutputType = {
    id: number
    userId: number
    checkinId: number
    recommendationDate: Date
    outfits: JsonValue
    makeup: JsonValue
    music: JsonValue
    feedbackPositive: boolean | null
    createdAt: Date
    _count: RecommendationCountAggregateOutputType | null
    _avg: RecommendationAvgAggregateOutputType | null
    _sum: RecommendationSumAggregateOutputType | null
    _min: RecommendationMinAggregateOutputType | null
    _max: RecommendationMaxAggregateOutputType | null
  }

  type GetRecommendationGroupByPayload<T extends RecommendationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecommendationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecommendationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecommendationGroupByOutputType[P]>
            : GetScalarType<T[P], RecommendationGroupByOutputType[P]>
        }
      >
    >


  export type RecommendationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinId?: boolean
    recommendationDate?: boolean
    outfits?: boolean
    makeup?: boolean
    music?: boolean
    feedbackPositive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendation"]>

  export type RecommendationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinId?: boolean
    recommendationDate?: boolean
    outfits?: boolean
    makeup?: boolean
    music?: boolean
    feedbackPositive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendation"]>

  export type RecommendationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    checkinId?: boolean
    recommendationDate?: boolean
    outfits?: boolean
    makeup?: boolean
    music?: boolean
    feedbackPositive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendation"]>

  export type RecommendationSelectScalar = {
    id?: boolean
    userId?: boolean
    checkinId?: boolean
    recommendationDate?: boolean
    outfits?: boolean
    makeup?: boolean
    music?: boolean
    feedbackPositive?: boolean
    createdAt?: boolean
  }

  export type RecommendationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "checkinId" | "recommendationDate" | "outfits" | "makeup" | "music" | "feedbackPositive" | "createdAt", ExtArgs["result"]["recommendation"]>
  export type RecommendationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }
  export type RecommendationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }
  export type RecommendationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dailyCheckIn?: boolean | DailyCheckInDefaultArgs<ExtArgs>
  }

  export type $RecommendationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recommendation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      dailyCheckIn: Prisma.$DailyCheckInPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      checkinId: number
      recommendationDate: Date
      outfits: Prisma.JsonValue
      makeup: Prisma.JsonValue
      music: Prisma.JsonValue
      feedbackPositive: boolean | null
      createdAt: Date
    }, ExtArgs["result"]["recommendation"]>
    composites: {}
  }

  type RecommendationGetPayload<S extends boolean | null | undefined | RecommendationDefaultArgs> = $Result.GetResult<Prisma.$RecommendationPayload, S>

  type RecommendationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecommendationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecommendationCountAggregateInputType | true
    }

  export interface RecommendationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recommendation'], meta: { name: 'Recommendation' } }
    /**
     * Find zero or one Recommendation that matches the filter.
     * @param {RecommendationFindUniqueArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecommendationFindUniqueArgs>(args: SelectSubset<T, RecommendationFindUniqueArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Recommendation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecommendationFindUniqueOrThrowArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecommendationFindUniqueOrThrowArgs>(args: SelectSubset<T, RecommendationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recommendation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindFirstArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecommendationFindFirstArgs>(args?: SelectSubset<T, RecommendationFindFirstArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recommendation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindFirstOrThrowArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecommendationFindFirstOrThrowArgs>(args?: SelectSubset<T, RecommendationFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Recommendations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recommendations
     * const recommendations = await prisma.recommendation.findMany()
     * 
     * // Get first 10 Recommendations
     * const recommendations = await prisma.recommendation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recommendationWithIdOnly = await prisma.recommendation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecommendationFindManyArgs>(args?: SelectSubset<T, RecommendationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Recommendation.
     * @param {RecommendationCreateArgs} args - Arguments to create a Recommendation.
     * @example
     * // Create one Recommendation
     * const Recommendation = await prisma.recommendation.create({
     *   data: {
     *     // ... data to create a Recommendation
     *   }
     * })
     * 
     */
    create<T extends RecommendationCreateArgs>(args: SelectSubset<T, RecommendationCreateArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Recommendations.
     * @param {RecommendationCreateManyArgs} args - Arguments to create many Recommendations.
     * @example
     * // Create many Recommendations
     * const recommendation = await prisma.recommendation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecommendationCreateManyArgs>(args?: SelectSubset<T, RecommendationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recommendations and returns the data saved in the database.
     * @param {RecommendationCreateManyAndReturnArgs} args - Arguments to create many Recommendations.
     * @example
     * // Create many Recommendations
     * const recommendation = await prisma.recommendation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recommendations and only return the `id`
     * const recommendationWithIdOnly = await prisma.recommendation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecommendationCreateManyAndReturnArgs>(args?: SelectSubset<T, RecommendationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Recommendation.
     * @param {RecommendationDeleteArgs} args - Arguments to delete one Recommendation.
     * @example
     * // Delete one Recommendation
     * const Recommendation = await prisma.recommendation.delete({
     *   where: {
     *     // ... filter to delete one Recommendation
     *   }
     * })
     * 
     */
    delete<T extends RecommendationDeleteArgs>(args: SelectSubset<T, RecommendationDeleteArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Recommendation.
     * @param {RecommendationUpdateArgs} args - Arguments to update one Recommendation.
     * @example
     * // Update one Recommendation
     * const recommendation = await prisma.recommendation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecommendationUpdateArgs>(args: SelectSubset<T, RecommendationUpdateArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Recommendations.
     * @param {RecommendationDeleteManyArgs} args - Arguments to filter Recommendations to delete.
     * @example
     * // Delete a few Recommendations
     * const { count } = await prisma.recommendation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecommendationDeleteManyArgs>(args?: SelectSubset<T, RecommendationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recommendations
     * const recommendation = await prisma.recommendation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecommendationUpdateManyArgs>(args: SelectSubset<T, RecommendationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recommendations and returns the data updated in the database.
     * @param {RecommendationUpdateManyAndReturnArgs} args - Arguments to update many Recommendations.
     * @example
     * // Update many Recommendations
     * const recommendation = await prisma.recommendation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Recommendations and only return the `id`
     * const recommendationWithIdOnly = await prisma.recommendation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecommendationUpdateManyAndReturnArgs>(args: SelectSubset<T, RecommendationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Recommendation.
     * @param {RecommendationUpsertArgs} args - Arguments to update or create a Recommendation.
     * @example
     * // Update or create a Recommendation
     * const recommendation = await prisma.recommendation.upsert({
     *   create: {
     *     // ... data to create a Recommendation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recommendation we want to update
     *   }
     * })
     */
    upsert<T extends RecommendationUpsertArgs>(args: SelectSubset<T, RecommendationUpsertArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Recommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationCountArgs} args - Arguments to filter Recommendations to count.
     * @example
     * // Count the number of Recommendations
     * const count = await prisma.recommendation.count({
     *   where: {
     *     // ... the filter for the Recommendations we want to count
     *   }
     * })
    **/
    count<T extends RecommendationCountArgs>(
      args?: Subset<T, RecommendationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecommendationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecommendationAggregateArgs>(args: Subset<T, RecommendationAggregateArgs>): Prisma.PrismaPromise<GetRecommendationAggregateType<T>>

    /**
     * Group by Recommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecommendationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecommendationGroupByArgs['orderBy'] }
        : { orderBy?: RecommendationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecommendationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecommendationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recommendation model
   */
  readonly fields: RecommendationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recommendation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecommendationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    dailyCheckIn<T extends DailyCheckInDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailyCheckInDefaultArgs<ExtArgs>>): Prisma__DailyCheckInClient<$Result.GetResult<Prisma.$DailyCheckInPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Recommendation model
   */
  interface RecommendationFieldRefs {
    readonly id: FieldRef<"Recommendation", 'Int'>
    readonly userId: FieldRef<"Recommendation", 'Int'>
    readonly checkinId: FieldRef<"Recommendation", 'Int'>
    readonly recommendationDate: FieldRef<"Recommendation", 'DateTime'>
    readonly outfits: FieldRef<"Recommendation", 'Json'>
    readonly makeup: FieldRef<"Recommendation", 'Json'>
    readonly music: FieldRef<"Recommendation", 'Json'>
    readonly feedbackPositive: FieldRef<"Recommendation", 'Boolean'>
    readonly createdAt: FieldRef<"Recommendation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recommendation findUnique
   */
  export type RecommendationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation findUniqueOrThrow
   */
  export type RecommendationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation findFirst
   */
  export type RecommendationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recommendations.
     */
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation findFirstOrThrow
   */
  export type RecommendationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recommendations.
     */
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation findMany
   */
  export type RecommendationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendations to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recommendations.
     */
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation create
   */
  export type RecommendationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The data needed to create a Recommendation.
     */
    data: XOR<RecommendationCreateInput, RecommendationUncheckedCreateInput>
  }

  /**
   * Recommendation createMany
   */
  export type RecommendationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recommendations.
     */
    data: RecommendationCreateManyInput | RecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recommendation createManyAndReturn
   */
  export type RecommendationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * The data used to create many Recommendations.
     */
    data: RecommendationCreateManyInput | RecommendationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recommendation update
   */
  export type RecommendationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The data needed to update a Recommendation.
     */
    data: XOR<RecommendationUpdateInput, RecommendationUncheckedUpdateInput>
    /**
     * Choose, which Recommendation to update.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation updateMany
   */
  export type RecommendationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recommendations.
     */
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyInput>
    /**
     * Filter which Recommendations to update
     */
    where?: RecommendationWhereInput
    /**
     * Limit how many Recommendations to update.
     */
    limit?: number
  }

  /**
   * Recommendation updateManyAndReturn
   */
  export type RecommendationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * The data used to update Recommendations.
     */
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyInput>
    /**
     * Filter which Recommendations to update
     */
    where?: RecommendationWhereInput
    /**
     * Limit how many Recommendations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recommendation upsert
   */
  export type RecommendationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The filter to search for the Recommendation to update in case it exists.
     */
    where: RecommendationWhereUniqueInput
    /**
     * In case the Recommendation found by the `where` argument doesn't exist, create a new Recommendation with this data.
     */
    create: XOR<RecommendationCreateInput, RecommendationUncheckedCreateInput>
    /**
     * In case the Recommendation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecommendationUpdateInput, RecommendationUncheckedUpdateInput>
  }

  /**
   * Recommendation delete
   */
  export type RecommendationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter which Recommendation to delete.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation deleteMany
   */
  export type RecommendationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recommendations to delete
     */
    where?: RecommendationWhereInput
    /**
     * Limit how many Recommendations to delete.
     */
    limit?: number
  }

  /**
   * Recommendation without action
   */
  export type RecommendationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recommendation
     */
    omit?: RecommendationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
  }


  /**
   * Model Streak
   */

  export type AggregateStreak = {
    _count: StreakCountAggregateOutputType | null
    _avg: StreakAvgAggregateOutputType | null
    _sum: StreakSumAggregateOutputType | null
    _min: StreakMinAggregateOutputType | null
    _max: StreakMaxAggregateOutputType | null
  }

  export type StreakAvgAggregateOutputType = {
    userId: number | null
    currentStreak: number | null
    maxStreak: number | null
  }

  export type StreakSumAggregateOutputType = {
    userId: number | null
    currentStreak: number | null
    maxStreak: number | null
  }

  export type StreakMinAggregateOutputType = {
    userId: number | null
    currentStreak: number | null
    maxStreak: number | null
    lastCheckinDate: Date | null
    weeklyFreezeUsedDate: Date | null
    updatedAt: Date | null
  }

  export type StreakMaxAggregateOutputType = {
    userId: number | null
    currentStreak: number | null
    maxStreak: number | null
    lastCheckinDate: Date | null
    weeklyFreezeUsedDate: Date | null
    updatedAt: Date | null
  }

  export type StreakCountAggregateOutputType = {
    userId: number
    currentStreak: number
    maxStreak: number
    lastCheckinDate: number
    weeklyFreezeUsedDate: number
    updatedAt: number
    _all: number
  }


  export type StreakAvgAggregateInputType = {
    userId?: true
    currentStreak?: true
    maxStreak?: true
  }

  export type StreakSumAggregateInputType = {
    userId?: true
    currentStreak?: true
    maxStreak?: true
  }

  export type StreakMinAggregateInputType = {
    userId?: true
    currentStreak?: true
    maxStreak?: true
    lastCheckinDate?: true
    weeklyFreezeUsedDate?: true
    updatedAt?: true
  }

  export type StreakMaxAggregateInputType = {
    userId?: true
    currentStreak?: true
    maxStreak?: true
    lastCheckinDate?: true
    weeklyFreezeUsedDate?: true
    updatedAt?: true
  }

  export type StreakCountAggregateInputType = {
    userId?: true
    currentStreak?: true
    maxStreak?: true
    lastCheckinDate?: true
    weeklyFreezeUsedDate?: true
    updatedAt?: true
    _all?: true
  }

  export type StreakAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Streak to aggregate.
     */
    where?: StreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Streaks to fetch.
     */
    orderBy?: StreakOrderByWithRelationInput | StreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Streaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Streaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Streaks
    **/
    _count?: true | StreakCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StreakAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StreakSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StreakMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StreakMaxAggregateInputType
  }

  export type GetStreakAggregateType<T extends StreakAggregateArgs> = {
        [P in keyof T & keyof AggregateStreak]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStreak[P]>
      : GetScalarType<T[P], AggregateStreak[P]>
  }




  export type StreakGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StreakWhereInput
    orderBy?: StreakOrderByWithAggregationInput | StreakOrderByWithAggregationInput[]
    by: StreakScalarFieldEnum[] | StreakScalarFieldEnum
    having?: StreakScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StreakCountAggregateInputType | true
    _avg?: StreakAvgAggregateInputType
    _sum?: StreakSumAggregateInputType
    _min?: StreakMinAggregateInputType
    _max?: StreakMaxAggregateInputType
  }

  export type StreakGroupByOutputType = {
    userId: number
    currentStreak: number
    maxStreak: number
    lastCheckinDate: Date | null
    weeklyFreezeUsedDate: Date | null
    updatedAt: Date
    _count: StreakCountAggregateOutputType | null
    _avg: StreakAvgAggregateOutputType | null
    _sum: StreakSumAggregateOutputType | null
    _min: StreakMinAggregateOutputType | null
    _max: StreakMaxAggregateOutputType | null
  }

  type GetStreakGroupByPayload<T extends StreakGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StreakGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StreakGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StreakGroupByOutputType[P]>
            : GetScalarType<T[P], StreakGroupByOutputType[P]>
        }
      >
    >


  export type StreakSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    currentStreak?: boolean
    maxStreak?: boolean
    lastCheckinDate?: boolean
    weeklyFreezeUsedDate?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["streak"]>

  export type StreakSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    currentStreak?: boolean
    maxStreak?: boolean
    lastCheckinDate?: boolean
    weeklyFreezeUsedDate?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["streak"]>

  export type StreakSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    currentStreak?: boolean
    maxStreak?: boolean
    lastCheckinDate?: boolean
    weeklyFreezeUsedDate?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["streak"]>

  export type StreakSelectScalar = {
    userId?: boolean
    currentStreak?: boolean
    maxStreak?: boolean
    lastCheckinDate?: boolean
    weeklyFreezeUsedDate?: boolean
    updatedAt?: boolean
  }

  export type StreakOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "currentStreak" | "maxStreak" | "lastCheckinDate" | "weeklyFreezeUsedDate" | "updatedAt", ExtArgs["result"]["streak"]>
  export type StreakInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StreakIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StreakIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StreakPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Streak"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      currentStreak: number
      maxStreak: number
      lastCheckinDate: Date | null
      weeklyFreezeUsedDate: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["streak"]>
    composites: {}
  }

  type StreakGetPayload<S extends boolean | null | undefined | StreakDefaultArgs> = $Result.GetResult<Prisma.$StreakPayload, S>

  type StreakCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StreakFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StreakCountAggregateInputType | true
    }

  export interface StreakDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Streak'], meta: { name: 'Streak' } }
    /**
     * Find zero or one Streak that matches the filter.
     * @param {StreakFindUniqueArgs} args - Arguments to find a Streak
     * @example
     * // Get one Streak
     * const streak = await prisma.streak.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StreakFindUniqueArgs>(args: SelectSubset<T, StreakFindUniqueArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Streak that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StreakFindUniqueOrThrowArgs} args - Arguments to find a Streak
     * @example
     * // Get one Streak
     * const streak = await prisma.streak.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StreakFindUniqueOrThrowArgs>(args: SelectSubset<T, StreakFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Streak that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakFindFirstArgs} args - Arguments to find a Streak
     * @example
     * // Get one Streak
     * const streak = await prisma.streak.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StreakFindFirstArgs>(args?: SelectSubset<T, StreakFindFirstArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Streak that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakFindFirstOrThrowArgs} args - Arguments to find a Streak
     * @example
     * // Get one Streak
     * const streak = await prisma.streak.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StreakFindFirstOrThrowArgs>(args?: SelectSubset<T, StreakFindFirstOrThrowArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Streaks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Streaks
     * const streaks = await prisma.streak.findMany()
     * 
     * // Get first 10 Streaks
     * const streaks = await prisma.streak.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const streakWithUserIdOnly = await prisma.streak.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends StreakFindManyArgs>(args?: SelectSubset<T, StreakFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Streak.
     * @param {StreakCreateArgs} args - Arguments to create a Streak.
     * @example
     * // Create one Streak
     * const Streak = await prisma.streak.create({
     *   data: {
     *     // ... data to create a Streak
     *   }
     * })
     * 
     */
    create<T extends StreakCreateArgs>(args: SelectSubset<T, StreakCreateArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Streaks.
     * @param {StreakCreateManyArgs} args - Arguments to create many Streaks.
     * @example
     * // Create many Streaks
     * const streak = await prisma.streak.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StreakCreateManyArgs>(args?: SelectSubset<T, StreakCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Streaks and returns the data saved in the database.
     * @param {StreakCreateManyAndReturnArgs} args - Arguments to create many Streaks.
     * @example
     * // Create many Streaks
     * const streak = await prisma.streak.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Streaks and only return the `userId`
     * const streakWithUserIdOnly = await prisma.streak.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StreakCreateManyAndReturnArgs>(args?: SelectSubset<T, StreakCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Streak.
     * @param {StreakDeleteArgs} args - Arguments to delete one Streak.
     * @example
     * // Delete one Streak
     * const Streak = await prisma.streak.delete({
     *   where: {
     *     // ... filter to delete one Streak
     *   }
     * })
     * 
     */
    delete<T extends StreakDeleteArgs>(args: SelectSubset<T, StreakDeleteArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Streak.
     * @param {StreakUpdateArgs} args - Arguments to update one Streak.
     * @example
     * // Update one Streak
     * const streak = await prisma.streak.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StreakUpdateArgs>(args: SelectSubset<T, StreakUpdateArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Streaks.
     * @param {StreakDeleteManyArgs} args - Arguments to filter Streaks to delete.
     * @example
     * // Delete a few Streaks
     * const { count } = await prisma.streak.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StreakDeleteManyArgs>(args?: SelectSubset<T, StreakDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Streaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Streaks
     * const streak = await prisma.streak.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StreakUpdateManyArgs>(args: SelectSubset<T, StreakUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Streaks and returns the data updated in the database.
     * @param {StreakUpdateManyAndReturnArgs} args - Arguments to update many Streaks.
     * @example
     * // Update many Streaks
     * const streak = await prisma.streak.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Streaks and only return the `userId`
     * const streakWithUserIdOnly = await prisma.streak.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StreakUpdateManyAndReturnArgs>(args: SelectSubset<T, StreakUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Streak.
     * @param {StreakUpsertArgs} args - Arguments to update or create a Streak.
     * @example
     * // Update or create a Streak
     * const streak = await prisma.streak.upsert({
     *   create: {
     *     // ... data to create a Streak
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Streak we want to update
     *   }
     * })
     */
    upsert<T extends StreakUpsertArgs>(args: SelectSubset<T, StreakUpsertArgs<ExtArgs>>): Prisma__StreakClient<$Result.GetResult<Prisma.$StreakPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Streaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakCountArgs} args - Arguments to filter Streaks to count.
     * @example
     * // Count the number of Streaks
     * const count = await prisma.streak.count({
     *   where: {
     *     // ... the filter for the Streaks we want to count
     *   }
     * })
    **/
    count<T extends StreakCountArgs>(
      args?: Subset<T, StreakCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StreakCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Streak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StreakAggregateArgs>(args: Subset<T, StreakAggregateArgs>): Prisma.PrismaPromise<GetStreakAggregateType<T>>

    /**
     * Group by Streak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StreakGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StreakGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StreakGroupByArgs['orderBy'] }
        : { orderBy?: StreakGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StreakGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStreakGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Streak model
   */
  readonly fields: StreakFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Streak.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StreakClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Streak model
   */
  interface StreakFieldRefs {
    readonly userId: FieldRef<"Streak", 'Int'>
    readonly currentStreak: FieldRef<"Streak", 'Int'>
    readonly maxStreak: FieldRef<"Streak", 'Int'>
    readonly lastCheckinDate: FieldRef<"Streak", 'DateTime'>
    readonly weeklyFreezeUsedDate: FieldRef<"Streak", 'DateTime'>
    readonly updatedAt: FieldRef<"Streak", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Streak findUnique
   */
  export type StreakFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter, which Streak to fetch.
     */
    where: StreakWhereUniqueInput
  }

  /**
   * Streak findUniqueOrThrow
   */
  export type StreakFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter, which Streak to fetch.
     */
    where: StreakWhereUniqueInput
  }

  /**
   * Streak findFirst
   */
  export type StreakFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter, which Streak to fetch.
     */
    where?: StreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Streaks to fetch.
     */
    orderBy?: StreakOrderByWithRelationInput | StreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Streaks.
     */
    cursor?: StreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Streaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Streaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Streaks.
     */
    distinct?: StreakScalarFieldEnum | StreakScalarFieldEnum[]
  }

  /**
   * Streak findFirstOrThrow
   */
  export type StreakFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter, which Streak to fetch.
     */
    where?: StreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Streaks to fetch.
     */
    orderBy?: StreakOrderByWithRelationInput | StreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Streaks.
     */
    cursor?: StreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Streaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Streaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Streaks.
     */
    distinct?: StreakScalarFieldEnum | StreakScalarFieldEnum[]
  }

  /**
   * Streak findMany
   */
  export type StreakFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter, which Streaks to fetch.
     */
    where?: StreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Streaks to fetch.
     */
    orderBy?: StreakOrderByWithRelationInput | StreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Streaks.
     */
    cursor?: StreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Streaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Streaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Streaks.
     */
    distinct?: StreakScalarFieldEnum | StreakScalarFieldEnum[]
  }

  /**
   * Streak create
   */
  export type StreakCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * The data needed to create a Streak.
     */
    data: XOR<StreakCreateInput, StreakUncheckedCreateInput>
  }

  /**
   * Streak createMany
   */
  export type StreakCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Streaks.
     */
    data: StreakCreateManyInput | StreakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Streak createManyAndReturn
   */
  export type StreakCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * The data used to create many Streaks.
     */
    data: StreakCreateManyInput | StreakCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Streak update
   */
  export type StreakUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * The data needed to update a Streak.
     */
    data: XOR<StreakUpdateInput, StreakUncheckedUpdateInput>
    /**
     * Choose, which Streak to update.
     */
    where: StreakWhereUniqueInput
  }

  /**
   * Streak updateMany
   */
  export type StreakUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Streaks.
     */
    data: XOR<StreakUpdateManyMutationInput, StreakUncheckedUpdateManyInput>
    /**
     * Filter which Streaks to update
     */
    where?: StreakWhereInput
    /**
     * Limit how many Streaks to update.
     */
    limit?: number
  }

  /**
   * Streak updateManyAndReturn
   */
  export type StreakUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * The data used to update Streaks.
     */
    data: XOR<StreakUpdateManyMutationInput, StreakUncheckedUpdateManyInput>
    /**
     * Filter which Streaks to update
     */
    where?: StreakWhereInput
    /**
     * Limit how many Streaks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Streak upsert
   */
  export type StreakUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * The filter to search for the Streak to update in case it exists.
     */
    where: StreakWhereUniqueInput
    /**
     * In case the Streak found by the `where` argument doesn't exist, create a new Streak with this data.
     */
    create: XOR<StreakCreateInput, StreakUncheckedCreateInput>
    /**
     * In case the Streak was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StreakUpdateInput, StreakUncheckedUpdateInput>
  }

  /**
   * Streak delete
   */
  export type StreakDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
    /**
     * Filter which Streak to delete.
     */
    where: StreakWhereUniqueInput
  }

  /**
   * Streak deleteMany
   */
  export type StreakDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Streaks to delete
     */
    where?: StreakWhereInput
    /**
     * Limit how many Streaks to delete.
     */
    limit?: number
  }

  /**
   * Streak without action
   */
  export type StreakDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Streak
     */
    select?: StreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Streak
     */
    omit?: StreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StreakInclude<ExtArgs> | null
  }


  /**
   * Model Badge
   */

  export type AggregateBadge = {
    _count: BadgeCountAggregateOutputType | null
    _avg: BadgeAvgAggregateOutputType | null
    _sum: BadgeSumAggregateOutputType | null
    _min: BadgeMinAggregateOutputType | null
    _max: BadgeMaxAggregateOutputType | null
  }

  export type BadgeAvgAggregateOutputType = {
    id: number | null
  }

  export type BadgeSumAggregateOutputType = {
    id: number | null
  }

  export type BadgeMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
  }

  export type BadgeMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
  }

  export type BadgeCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    criteria: number
    _all: number
  }


  export type BadgeAvgAggregateInputType = {
    id?: true
  }

  export type BadgeSumAggregateInputType = {
    id?: true
  }

  export type BadgeMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
  }

  export type BadgeMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
  }

  export type BadgeCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    criteria?: true
    _all?: true
  }

  export type BadgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Badge to aggregate.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Badges
    **/
    _count?: true | BadgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BadgeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BadgeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BadgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BadgeMaxAggregateInputType
  }

  export type GetBadgeAggregateType<T extends BadgeAggregateArgs> = {
        [P in keyof T & keyof AggregateBadge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBadge[P]>
      : GetScalarType<T[P], AggregateBadge[P]>
  }




  export type BadgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeWhereInput
    orderBy?: BadgeOrderByWithAggregationInput | BadgeOrderByWithAggregationInput[]
    by: BadgeScalarFieldEnum[] | BadgeScalarFieldEnum
    having?: BadgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BadgeCountAggregateInputType | true
    _avg?: BadgeAvgAggregateInputType
    _sum?: BadgeSumAggregateInputType
    _min?: BadgeMinAggregateInputType
    _max?: BadgeMaxAggregateInputType
  }

  export type BadgeGroupByOutputType = {
    id: number
    code: string
    name: string
    description: string
    criteria: JsonValue
    _count: BadgeCountAggregateOutputType | null
    _avg: BadgeAvgAggregateOutputType | null
    _sum: BadgeSumAggregateOutputType | null
    _min: BadgeMinAggregateOutputType | null
    _max: BadgeMaxAggregateOutputType | null
  }

  type GetBadgeGroupByPayload<T extends BadgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BadgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BadgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BadgeGroupByOutputType[P]>
            : GetScalarType<T[P], BadgeGroupByOutputType[P]>
        }
      >
    >


  export type BadgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    criteria?: boolean
    userBadges?: boolean | Badge$userBadgesArgs<ExtArgs>
    _count?: boolean | BadgeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    criteria?: boolean
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    criteria?: boolean
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    criteria?: boolean
  }

  export type BadgeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "description" | "criteria", ExtArgs["result"]["badge"]>
  export type BadgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userBadges?: boolean | Badge$userBadgesArgs<ExtArgs>
    _count?: boolean | BadgeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BadgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BadgeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BadgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Badge"
    objects: {
      userBadges: Prisma.$UserBadgePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      description: string
      criteria: Prisma.JsonValue
    }, ExtArgs["result"]["badge"]>
    composites: {}
  }

  type BadgeGetPayload<S extends boolean | null | undefined | BadgeDefaultArgs> = $Result.GetResult<Prisma.$BadgePayload, S>

  type BadgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BadgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BadgeCountAggregateInputType | true
    }

  export interface BadgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Badge'], meta: { name: 'Badge' } }
    /**
     * Find zero or one Badge that matches the filter.
     * @param {BadgeFindUniqueArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BadgeFindUniqueArgs>(args: SelectSubset<T, BadgeFindUniqueArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Badge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BadgeFindUniqueOrThrowArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BadgeFindUniqueOrThrowArgs>(args: SelectSubset<T, BadgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Badge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindFirstArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BadgeFindFirstArgs>(args?: SelectSubset<T, BadgeFindFirstArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Badge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindFirstOrThrowArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BadgeFindFirstOrThrowArgs>(args?: SelectSubset<T, BadgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Badges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Badges
     * const badges = await prisma.badge.findMany()
     * 
     * // Get first 10 Badges
     * const badges = await prisma.badge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const badgeWithIdOnly = await prisma.badge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BadgeFindManyArgs>(args?: SelectSubset<T, BadgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Badge.
     * @param {BadgeCreateArgs} args - Arguments to create a Badge.
     * @example
     * // Create one Badge
     * const Badge = await prisma.badge.create({
     *   data: {
     *     // ... data to create a Badge
     *   }
     * })
     * 
     */
    create<T extends BadgeCreateArgs>(args: SelectSubset<T, BadgeCreateArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Badges.
     * @param {BadgeCreateManyArgs} args - Arguments to create many Badges.
     * @example
     * // Create many Badges
     * const badge = await prisma.badge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BadgeCreateManyArgs>(args?: SelectSubset<T, BadgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Badges and returns the data saved in the database.
     * @param {BadgeCreateManyAndReturnArgs} args - Arguments to create many Badges.
     * @example
     * // Create many Badges
     * const badge = await prisma.badge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Badges and only return the `id`
     * const badgeWithIdOnly = await prisma.badge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BadgeCreateManyAndReturnArgs>(args?: SelectSubset<T, BadgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Badge.
     * @param {BadgeDeleteArgs} args - Arguments to delete one Badge.
     * @example
     * // Delete one Badge
     * const Badge = await prisma.badge.delete({
     *   where: {
     *     // ... filter to delete one Badge
     *   }
     * })
     * 
     */
    delete<T extends BadgeDeleteArgs>(args: SelectSubset<T, BadgeDeleteArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Badge.
     * @param {BadgeUpdateArgs} args - Arguments to update one Badge.
     * @example
     * // Update one Badge
     * const badge = await prisma.badge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BadgeUpdateArgs>(args: SelectSubset<T, BadgeUpdateArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Badges.
     * @param {BadgeDeleteManyArgs} args - Arguments to filter Badges to delete.
     * @example
     * // Delete a few Badges
     * const { count } = await prisma.badge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BadgeDeleteManyArgs>(args?: SelectSubset<T, BadgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Badges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Badges
     * const badge = await prisma.badge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BadgeUpdateManyArgs>(args: SelectSubset<T, BadgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Badges and returns the data updated in the database.
     * @param {BadgeUpdateManyAndReturnArgs} args - Arguments to update many Badges.
     * @example
     * // Update many Badges
     * const badge = await prisma.badge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Badges and only return the `id`
     * const badgeWithIdOnly = await prisma.badge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BadgeUpdateManyAndReturnArgs>(args: SelectSubset<T, BadgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Badge.
     * @param {BadgeUpsertArgs} args - Arguments to update or create a Badge.
     * @example
     * // Update or create a Badge
     * const badge = await prisma.badge.upsert({
     *   create: {
     *     // ... data to create a Badge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Badge we want to update
     *   }
     * })
     */
    upsert<T extends BadgeUpsertArgs>(args: SelectSubset<T, BadgeUpsertArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Badges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeCountArgs} args - Arguments to filter Badges to count.
     * @example
     * // Count the number of Badges
     * const count = await prisma.badge.count({
     *   where: {
     *     // ... the filter for the Badges we want to count
     *   }
     * })
    **/
    count<T extends BadgeCountArgs>(
      args?: Subset<T, BadgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BadgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Badge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BadgeAggregateArgs>(args: Subset<T, BadgeAggregateArgs>): Prisma.PrismaPromise<GetBadgeAggregateType<T>>

    /**
     * Group by Badge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BadgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BadgeGroupByArgs['orderBy'] }
        : { orderBy?: BadgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BadgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBadgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Badge model
   */
  readonly fields: BadgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Badge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BadgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userBadges<T extends Badge$userBadgesArgs<ExtArgs> = {}>(args?: Subset<T, Badge$userBadgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Badge model
   */
  interface BadgeFieldRefs {
    readonly id: FieldRef<"Badge", 'Int'>
    readonly code: FieldRef<"Badge", 'String'>
    readonly name: FieldRef<"Badge", 'String'>
    readonly description: FieldRef<"Badge", 'String'>
    readonly criteria: FieldRef<"Badge", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Badge findUnique
   */
  export type BadgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge findUniqueOrThrow
   */
  export type BadgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge findFirst
   */
  export type BadgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Badges.
     */
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge findFirstOrThrow
   */
  export type BadgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Badges.
     */
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge findMany
   */
  export type BadgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badges to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Badges.
     */
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge create
   */
  export type BadgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The data needed to create a Badge.
     */
    data: XOR<BadgeCreateInput, BadgeUncheckedCreateInput>
  }

  /**
   * Badge createMany
   */
  export type BadgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Badges.
     */
    data: BadgeCreateManyInput | BadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Badge createManyAndReturn
   */
  export type BadgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * The data used to create many Badges.
     */
    data: BadgeCreateManyInput | BadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Badge update
   */
  export type BadgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The data needed to update a Badge.
     */
    data: XOR<BadgeUpdateInput, BadgeUncheckedUpdateInput>
    /**
     * Choose, which Badge to update.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge updateMany
   */
  export type BadgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Badges.
     */
    data: XOR<BadgeUpdateManyMutationInput, BadgeUncheckedUpdateManyInput>
    /**
     * Filter which Badges to update
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to update.
     */
    limit?: number
  }

  /**
   * Badge updateManyAndReturn
   */
  export type BadgeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * The data used to update Badges.
     */
    data: XOR<BadgeUpdateManyMutationInput, BadgeUncheckedUpdateManyInput>
    /**
     * Filter which Badges to update
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to update.
     */
    limit?: number
  }

  /**
   * Badge upsert
   */
  export type BadgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The filter to search for the Badge to update in case it exists.
     */
    where: BadgeWhereUniqueInput
    /**
     * In case the Badge found by the `where` argument doesn't exist, create a new Badge with this data.
     */
    create: XOR<BadgeCreateInput, BadgeUncheckedCreateInput>
    /**
     * In case the Badge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BadgeUpdateInput, BadgeUncheckedUpdateInput>
  }

  /**
   * Badge delete
   */
  export type BadgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter which Badge to delete.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge deleteMany
   */
  export type BadgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Badges to delete
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to delete.
     */
    limit?: number
  }

  /**
   * Badge.userBadges
   */
  export type Badge$userBadgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    cursor?: UserBadgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * Badge without action
   */
  export type BadgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
  }


  /**
   * Model UserBadge
   */

  export type AggregateUserBadge = {
    _count: UserBadgeCountAggregateOutputType | null
    _avg: UserBadgeAvgAggregateOutputType | null
    _sum: UserBadgeSumAggregateOutputType | null
    _min: UserBadgeMinAggregateOutputType | null
    _max: UserBadgeMaxAggregateOutputType | null
  }

  export type UserBadgeAvgAggregateOutputType = {
    userId: number | null
    badgeId: number | null
    progress: number | null
  }

  export type UserBadgeSumAggregateOutputType = {
    userId: number | null
    badgeId: number | null
    progress: number | null
  }

  export type UserBadgeMinAggregateOutputType = {
    userId: number | null
    badgeId: number | null
    progress: number | null
    unlockedAt: Date | null
  }

  export type UserBadgeMaxAggregateOutputType = {
    userId: number | null
    badgeId: number | null
    progress: number | null
    unlockedAt: Date | null
  }

  export type UserBadgeCountAggregateOutputType = {
    userId: number
    badgeId: number
    progress: number
    unlockedAt: number
    _all: number
  }


  export type UserBadgeAvgAggregateInputType = {
    userId?: true
    badgeId?: true
    progress?: true
  }

  export type UserBadgeSumAggregateInputType = {
    userId?: true
    badgeId?: true
    progress?: true
  }

  export type UserBadgeMinAggregateInputType = {
    userId?: true
    badgeId?: true
    progress?: true
    unlockedAt?: true
  }

  export type UserBadgeMaxAggregateInputType = {
    userId?: true
    badgeId?: true
    progress?: true
    unlockedAt?: true
  }

  export type UserBadgeCountAggregateInputType = {
    userId?: true
    badgeId?: true
    progress?: true
    unlockedAt?: true
    _all?: true
  }

  export type UserBadgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBadge to aggregate.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserBadges
    **/
    _count?: true | UserBadgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserBadgeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserBadgeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserBadgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserBadgeMaxAggregateInputType
  }

  export type GetUserBadgeAggregateType<T extends UserBadgeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserBadge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserBadge[P]>
      : GetScalarType<T[P], AggregateUserBadge[P]>
  }




  export type UserBadgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithAggregationInput | UserBadgeOrderByWithAggregationInput[]
    by: UserBadgeScalarFieldEnum[] | UserBadgeScalarFieldEnum
    having?: UserBadgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserBadgeCountAggregateInputType | true
    _avg?: UserBadgeAvgAggregateInputType
    _sum?: UserBadgeSumAggregateInputType
    _min?: UserBadgeMinAggregateInputType
    _max?: UserBadgeMaxAggregateInputType
  }

  export type UserBadgeGroupByOutputType = {
    userId: number
    badgeId: number
    progress: number
    unlockedAt: Date | null
    _count: UserBadgeCountAggregateOutputType | null
    _avg: UserBadgeAvgAggregateOutputType | null
    _sum: UserBadgeSumAggregateOutputType | null
    _min: UserBadgeMinAggregateOutputType | null
    _max: UserBadgeMaxAggregateOutputType | null
  }

  type GetUserBadgeGroupByPayload<T extends UserBadgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserBadgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserBadgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserBadgeGroupByOutputType[P]>
            : GetScalarType<T[P], UserBadgeGroupByOutputType[P]>
        }
      >
    >


  export type UserBadgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    badgeId?: boolean
    progress?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    badgeId?: boolean
    progress?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    badgeId?: boolean
    progress?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectScalar = {
    userId?: boolean
    badgeId?: boolean
    progress?: boolean
    unlockedAt?: boolean
  }

  export type UserBadgeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "badgeId" | "progress" | "unlockedAt", ExtArgs["result"]["userBadge"]>
  export type UserBadgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }
  export type UserBadgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }
  export type UserBadgeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
  }

  export type $UserBadgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserBadge"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      badge: Prisma.$BadgePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      badgeId: number
      progress: number
      unlockedAt: Date | null
    }, ExtArgs["result"]["userBadge"]>
    composites: {}
  }

  type UserBadgeGetPayload<S extends boolean | null | undefined | UserBadgeDefaultArgs> = $Result.GetResult<Prisma.$UserBadgePayload, S>

  type UserBadgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserBadgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserBadgeCountAggregateInputType | true
    }

  export interface UserBadgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserBadge'], meta: { name: 'UserBadge' } }
    /**
     * Find zero or one UserBadge that matches the filter.
     * @param {UserBadgeFindUniqueArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserBadgeFindUniqueArgs>(args: SelectSubset<T, UserBadgeFindUniqueArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserBadge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserBadgeFindUniqueOrThrowArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserBadgeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserBadgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBadge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindFirstArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserBadgeFindFirstArgs>(args?: SelectSubset<T, UserBadgeFindFirstArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBadge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindFirstOrThrowArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserBadgeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserBadgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserBadges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserBadges
     * const userBadges = await prisma.userBadge.findMany()
     * 
     * // Get first 10 UserBadges
     * const userBadges = await prisma.userBadge.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userBadgeWithUserIdOnly = await prisma.userBadge.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserBadgeFindManyArgs>(args?: SelectSubset<T, UserBadgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserBadge.
     * @param {UserBadgeCreateArgs} args - Arguments to create a UserBadge.
     * @example
     * // Create one UserBadge
     * const UserBadge = await prisma.userBadge.create({
     *   data: {
     *     // ... data to create a UserBadge
     *   }
     * })
     * 
     */
    create<T extends UserBadgeCreateArgs>(args: SelectSubset<T, UserBadgeCreateArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserBadges.
     * @param {UserBadgeCreateManyArgs} args - Arguments to create many UserBadges.
     * @example
     * // Create many UserBadges
     * const userBadge = await prisma.userBadge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserBadgeCreateManyArgs>(args?: SelectSubset<T, UserBadgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserBadges and returns the data saved in the database.
     * @param {UserBadgeCreateManyAndReturnArgs} args - Arguments to create many UserBadges.
     * @example
     * // Create many UserBadges
     * const userBadge = await prisma.userBadge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserBadges and only return the `userId`
     * const userBadgeWithUserIdOnly = await prisma.userBadge.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserBadgeCreateManyAndReturnArgs>(args?: SelectSubset<T, UserBadgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserBadge.
     * @param {UserBadgeDeleteArgs} args - Arguments to delete one UserBadge.
     * @example
     * // Delete one UserBadge
     * const UserBadge = await prisma.userBadge.delete({
     *   where: {
     *     // ... filter to delete one UserBadge
     *   }
     * })
     * 
     */
    delete<T extends UserBadgeDeleteArgs>(args: SelectSubset<T, UserBadgeDeleteArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserBadge.
     * @param {UserBadgeUpdateArgs} args - Arguments to update one UserBadge.
     * @example
     * // Update one UserBadge
     * const userBadge = await prisma.userBadge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserBadgeUpdateArgs>(args: SelectSubset<T, UserBadgeUpdateArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserBadges.
     * @param {UserBadgeDeleteManyArgs} args - Arguments to filter UserBadges to delete.
     * @example
     * // Delete a few UserBadges
     * const { count } = await prisma.userBadge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserBadgeDeleteManyArgs>(args?: SelectSubset<T, UserBadgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBadges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserBadges
     * const userBadge = await prisma.userBadge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserBadgeUpdateManyArgs>(args: SelectSubset<T, UserBadgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBadges and returns the data updated in the database.
     * @param {UserBadgeUpdateManyAndReturnArgs} args - Arguments to update many UserBadges.
     * @example
     * // Update many UserBadges
     * const userBadge = await prisma.userBadge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserBadges and only return the `userId`
     * const userBadgeWithUserIdOnly = await prisma.userBadge.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserBadgeUpdateManyAndReturnArgs>(args: SelectSubset<T, UserBadgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserBadge.
     * @param {UserBadgeUpsertArgs} args - Arguments to update or create a UserBadge.
     * @example
     * // Update or create a UserBadge
     * const userBadge = await prisma.userBadge.upsert({
     *   create: {
     *     // ... data to create a UserBadge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserBadge we want to update
     *   }
     * })
     */
    upsert<T extends UserBadgeUpsertArgs>(args: SelectSubset<T, UserBadgeUpsertArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserBadges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeCountArgs} args - Arguments to filter UserBadges to count.
     * @example
     * // Count the number of UserBadges
     * const count = await prisma.userBadge.count({
     *   where: {
     *     // ... the filter for the UserBadges we want to count
     *   }
     * })
    **/
    count<T extends UserBadgeCountArgs>(
      args?: Subset<T, UserBadgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserBadgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserBadge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserBadgeAggregateArgs>(args: Subset<T, UserBadgeAggregateArgs>): Prisma.PrismaPromise<GetUserBadgeAggregateType<T>>

    /**
     * Group by UserBadge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserBadgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserBadgeGroupByArgs['orderBy'] }
        : { orderBy?: UserBadgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserBadgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBadgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserBadge model
   */
  readonly fields: UserBadgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserBadge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserBadgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    badge<T extends BadgeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BadgeDefaultArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserBadge model
   */
  interface UserBadgeFieldRefs {
    readonly userId: FieldRef<"UserBadge", 'Int'>
    readonly badgeId: FieldRef<"UserBadge", 'Int'>
    readonly progress: FieldRef<"UserBadge", 'Int'>
    readonly unlockedAt: FieldRef<"UserBadge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserBadge findUnique
   */
  export type UserBadgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge findUniqueOrThrow
   */
  export type UserBadgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge findFirst
   */
  export type UserBadgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBadges.
     */
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge findFirstOrThrow
   */
  export type UserBadgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBadges.
     */
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge findMany
   */
  export type UserBadgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadges to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBadges.
     */
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge create
   */
  export type UserBadgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The data needed to create a UserBadge.
     */
    data: XOR<UserBadgeCreateInput, UserBadgeUncheckedCreateInput>
  }

  /**
   * UserBadge createMany
   */
  export type UserBadgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserBadges.
     */
    data: UserBadgeCreateManyInput | UserBadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserBadge createManyAndReturn
   */
  export type UserBadgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * The data used to create many UserBadges.
     */
    data: UserBadgeCreateManyInput | UserBadgeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBadge update
   */
  export type UserBadgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The data needed to update a UserBadge.
     */
    data: XOR<UserBadgeUpdateInput, UserBadgeUncheckedUpdateInput>
    /**
     * Choose, which UserBadge to update.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge updateMany
   */
  export type UserBadgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserBadges.
     */
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyInput>
    /**
     * Filter which UserBadges to update
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to update.
     */
    limit?: number
  }

  /**
   * UserBadge updateManyAndReturn
   */
  export type UserBadgeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * The data used to update UserBadges.
     */
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyInput>
    /**
     * Filter which UserBadges to update
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBadge upsert
   */
  export type UserBadgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The filter to search for the UserBadge to update in case it exists.
     */
    where: UserBadgeWhereUniqueInput
    /**
     * In case the UserBadge found by the `where` argument doesn't exist, create a new UserBadge with this data.
     */
    create: XOR<UserBadgeCreateInput, UserBadgeUncheckedCreateInput>
    /**
     * In case the UserBadge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserBadgeUpdateInput, UserBadgeUncheckedUpdateInput>
  }

  /**
   * UserBadge delete
   */
  export type UserBadgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter which UserBadge to delete.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge deleteMany
   */
  export type UserBadgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBadges to delete
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to delete.
     */
    limit?: number
  }

  /**
   * UserBadge without action
   */
  export type UserBadgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    displayName: 'displayName',
    gender: 'gender',
    age: 'age',
    height: 'height',
    origin: 'origin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProfilePreferenceScalarFieldEnum: {
    userId: 'userId',
    styleTags: 'styleTags',
    colorPreferences: 'colorPreferences',
    musicPreferences: 'musicPreferences',
    updatedAt: 'updatedAt'
  };

  export type ProfilePreferenceScalarFieldEnum = (typeof ProfilePreferenceScalarFieldEnum)[keyof typeof ProfilePreferenceScalarFieldEnum]


  export const DailyCheckInScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    checkinDate: 'checkinDate',
    moodDetected: 'moodDetected',
    moodSelected: 'moodSelected',
    answers: 'answers',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt'
  };

  export type DailyCheckInScalarFieldEnum = (typeof DailyCheckInScalarFieldEnum)[keyof typeof DailyCheckInScalarFieldEnum]


  export const RecommendationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    checkinId: 'checkinId',
    recommendationDate: 'recommendationDate',
    outfits: 'outfits',
    makeup: 'makeup',
    music: 'music',
    feedbackPositive: 'feedbackPositive',
    createdAt: 'createdAt'
  };

  export type RecommendationScalarFieldEnum = (typeof RecommendationScalarFieldEnum)[keyof typeof RecommendationScalarFieldEnum]


  export const StreakScalarFieldEnum: {
    userId: 'userId',
    currentStreak: 'currentStreak',
    maxStreak: 'maxStreak',
    lastCheckinDate: 'lastCheckinDate',
    weeklyFreezeUsedDate: 'weeklyFreezeUsedDate',
    updatedAt: 'updatedAt'
  };

  export type StreakScalarFieldEnum = (typeof StreakScalarFieldEnum)[keyof typeof StreakScalarFieldEnum]


  export const BadgeScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    criteria: 'criteria'
  };

  export type BadgeScalarFieldEnum = (typeof BadgeScalarFieldEnum)[keyof typeof BadgeScalarFieldEnum]


  export const UserBadgeScalarFieldEnum: {
    userId: 'userId',
    badgeId: 'badgeId',
    progress: 'progress',
    unlockedAt: 'unlockedAt'
  };

  export type UserBadgeScalarFieldEnum = (typeof UserBadgeScalarFieldEnum)[keyof typeof UserBadgeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringFilter<"User"> | string
    gender?: StringFilter<"User"> | string
    age?: IntFilter<"User"> | number
    height?: IntNullableFilter<"User"> | number | null
    origin?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profilePreferences?: XOR<ProfilePreferenceNullableScalarRelationFilter, ProfilePreferenceWhereInput> | null
    dailyCheckIns?: DailyCheckInListRelationFilter
    recommendations?: RecommendationListRelationFilter
    streak?: XOR<StreakNullableScalarRelationFilter, StreakWhereInput> | null
    userBadges?: UserBadgeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    gender?: SortOrder
    age?: SortOrder
    height?: SortOrderInput | SortOrder
    origin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profilePreferences?: ProfilePreferenceOrderByWithRelationInput
    dailyCheckIns?: DailyCheckInOrderByRelationAggregateInput
    recommendations?: RecommendationOrderByRelationAggregateInput
    streak?: StreakOrderByWithRelationInput
    userBadges?: UserBadgeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringFilter<"User"> | string
    gender?: StringFilter<"User"> | string
    age?: IntFilter<"User"> | number
    height?: IntNullableFilter<"User"> | number | null
    origin?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profilePreferences?: XOR<ProfilePreferenceNullableScalarRelationFilter, ProfilePreferenceWhereInput> | null
    dailyCheckIns?: DailyCheckInListRelationFilter
    recommendations?: RecommendationListRelationFilter
    streak?: XOR<StreakNullableScalarRelationFilter, StreakWhereInput> | null
    userBadges?: UserBadgeListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    gender?: SortOrder
    age?: SortOrder
    height?: SortOrderInput | SortOrder
    origin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringWithAggregatesFilter<"User"> | string
    gender?: StringWithAggregatesFilter<"User"> | string
    age?: IntWithAggregatesFilter<"User"> | number
    height?: IntNullableWithAggregatesFilter<"User"> | number | null
    origin?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProfilePreferenceWhereInput = {
    AND?: ProfilePreferenceWhereInput | ProfilePreferenceWhereInput[]
    OR?: ProfilePreferenceWhereInput[]
    NOT?: ProfilePreferenceWhereInput | ProfilePreferenceWhereInput[]
    userId?: IntFilter<"ProfilePreference"> | number
    styleTags?: JsonFilter<"ProfilePreference">
    colorPreferences?: JsonFilter<"ProfilePreference">
    musicPreferences?: JsonFilter<"ProfilePreference">
    updatedAt?: DateTimeFilter<"ProfilePreference"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProfilePreferenceOrderByWithRelationInput = {
    userId?: SortOrder
    styleTags?: SortOrder
    colorPreferences?: SortOrder
    musicPreferences?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ProfilePreferenceWhereUniqueInput = Prisma.AtLeast<{
    userId?: number
    AND?: ProfilePreferenceWhereInput | ProfilePreferenceWhereInput[]
    OR?: ProfilePreferenceWhereInput[]
    NOT?: ProfilePreferenceWhereInput | ProfilePreferenceWhereInput[]
    styleTags?: JsonFilter<"ProfilePreference">
    colorPreferences?: JsonFilter<"ProfilePreference">
    musicPreferences?: JsonFilter<"ProfilePreference">
    updatedAt?: DateTimeFilter<"ProfilePreference"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "userId">

  export type ProfilePreferenceOrderByWithAggregationInput = {
    userId?: SortOrder
    styleTags?: SortOrder
    colorPreferences?: SortOrder
    musicPreferences?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfilePreferenceCountOrderByAggregateInput
    _avg?: ProfilePreferenceAvgOrderByAggregateInput
    _max?: ProfilePreferenceMaxOrderByAggregateInput
    _min?: ProfilePreferenceMinOrderByAggregateInput
    _sum?: ProfilePreferenceSumOrderByAggregateInput
  }

  export type ProfilePreferenceScalarWhereWithAggregatesInput = {
    AND?: ProfilePreferenceScalarWhereWithAggregatesInput | ProfilePreferenceScalarWhereWithAggregatesInput[]
    OR?: ProfilePreferenceScalarWhereWithAggregatesInput[]
    NOT?: ProfilePreferenceScalarWhereWithAggregatesInput | ProfilePreferenceScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"ProfilePreference"> | number
    styleTags?: JsonWithAggregatesFilter<"ProfilePreference">
    colorPreferences?: JsonWithAggregatesFilter<"ProfilePreference">
    musicPreferences?: JsonWithAggregatesFilter<"ProfilePreference">
    updatedAt?: DateTimeWithAggregatesFilter<"ProfilePreference"> | Date | string
  }

  export type DailyCheckInWhereInput = {
    AND?: DailyCheckInWhereInput | DailyCheckInWhereInput[]
    OR?: DailyCheckInWhereInput[]
    NOT?: DailyCheckInWhereInput | DailyCheckInWhereInput[]
    id?: IntFilter<"DailyCheckIn"> | number
    userId?: IntFilter<"DailyCheckIn"> | number
    checkinDate?: DateTimeFilter<"DailyCheckIn"> | Date | string
    moodDetected?: StringFilter<"DailyCheckIn"> | string
    moodSelected?: StringFilter<"DailyCheckIn"> | string
    answers?: JsonFilter<"DailyCheckIn">
    imageUrl?: StringNullableFilter<"DailyCheckIn"> | string | null
    createdAt?: DateTimeFilter<"DailyCheckIn"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    recommendations?: RecommendationListRelationFilter
  }

  export type DailyCheckInOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinDate?: SortOrder
    moodDetected?: SortOrder
    moodSelected?: SortOrder
    answers?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    recommendations?: RecommendationOrderByRelationAggregateInput
  }

  export type DailyCheckInWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_checkinDate?: DailyCheckInUserIdCheckinDateCompoundUniqueInput
    AND?: DailyCheckInWhereInput | DailyCheckInWhereInput[]
    OR?: DailyCheckInWhereInput[]
    NOT?: DailyCheckInWhereInput | DailyCheckInWhereInput[]
    userId?: IntFilter<"DailyCheckIn"> | number
    checkinDate?: DateTimeFilter<"DailyCheckIn"> | Date | string
    moodDetected?: StringFilter<"DailyCheckIn"> | string
    moodSelected?: StringFilter<"DailyCheckIn"> | string
    answers?: JsonFilter<"DailyCheckIn">
    imageUrl?: StringNullableFilter<"DailyCheckIn"> | string | null
    createdAt?: DateTimeFilter<"DailyCheckIn"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    recommendations?: RecommendationListRelationFilter
  }, "id" | "userId_checkinDate">

  export type DailyCheckInOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinDate?: SortOrder
    moodDetected?: SortOrder
    moodSelected?: SortOrder
    answers?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DailyCheckInCountOrderByAggregateInput
    _avg?: DailyCheckInAvgOrderByAggregateInput
    _max?: DailyCheckInMaxOrderByAggregateInput
    _min?: DailyCheckInMinOrderByAggregateInput
    _sum?: DailyCheckInSumOrderByAggregateInput
  }

  export type DailyCheckInScalarWhereWithAggregatesInput = {
    AND?: DailyCheckInScalarWhereWithAggregatesInput | DailyCheckInScalarWhereWithAggregatesInput[]
    OR?: DailyCheckInScalarWhereWithAggregatesInput[]
    NOT?: DailyCheckInScalarWhereWithAggregatesInput | DailyCheckInScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DailyCheckIn"> | number
    userId?: IntWithAggregatesFilter<"DailyCheckIn"> | number
    checkinDate?: DateTimeWithAggregatesFilter<"DailyCheckIn"> | Date | string
    moodDetected?: StringWithAggregatesFilter<"DailyCheckIn"> | string
    moodSelected?: StringWithAggregatesFilter<"DailyCheckIn"> | string
    answers?: JsonWithAggregatesFilter<"DailyCheckIn">
    imageUrl?: StringNullableWithAggregatesFilter<"DailyCheckIn"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DailyCheckIn"> | Date | string
  }

  export type RecommendationWhereInput = {
    AND?: RecommendationWhereInput | RecommendationWhereInput[]
    OR?: RecommendationWhereInput[]
    NOT?: RecommendationWhereInput | RecommendationWhereInput[]
    id?: IntFilter<"Recommendation"> | number
    userId?: IntFilter<"Recommendation"> | number
    checkinId?: IntFilter<"Recommendation"> | number
    recommendationDate?: DateTimeFilter<"Recommendation"> | Date | string
    outfits?: JsonFilter<"Recommendation">
    makeup?: JsonFilter<"Recommendation">
    music?: JsonFilter<"Recommendation">
    feedbackPositive?: BoolNullableFilter<"Recommendation"> | boolean | null
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    dailyCheckIn?: XOR<DailyCheckInScalarRelationFilter, DailyCheckInWhereInput>
  }

  export type RecommendationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
    recommendationDate?: SortOrder
    outfits?: SortOrder
    makeup?: SortOrder
    music?: SortOrder
    feedbackPositive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    dailyCheckIn?: DailyCheckInOrderByWithRelationInput
  }

  export type RecommendationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RecommendationWhereInput | RecommendationWhereInput[]
    OR?: RecommendationWhereInput[]
    NOT?: RecommendationWhereInput | RecommendationWhereInput[]
    userId?: IntFilter<"Recommendation"> | number
    checkinId?: IntFilter<"Recommendation"> | number
    recommendationDate?: DateTimeFilter<"Recommendation"> | Date | string
    outfits?: JsonFilter<"Recommendation">
    makeup?: JsonFilter<"Recommendation">
    music?: JsonFilter<"Recommendation">
    feedbackPositive?: BoolNullableFilter<"Recommendation"> | boolean | null
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    dailyCheckIn?: XOR<DailyCheckInScalarRelationFilter, DailyCheckInWhereInput>
  }, "id">

  export type RecommendationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
    recommendationDate?: SortOrder
    outfits?: SortOrder
    makeup?: SortOrder
    music?: SortOrder
    feedbackPositive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RecommendationCountOrderByAggregateInput
    _avg?: RecommendationAvgOrderByAggregateInput
    _max?: RecommendationMaxOrderByAggregateInput
    _min?: RecommendationMinOrderByAggregateInput
    _sum?: RecommendationSumOrderByAggregateInput
  }

  export type RecommendationScalarWhereWithAggregatesInput = {
    AND?: RecommendationScalarWhereWithAggregatesInput | RecommendationScalarWhereWithAggregatesInput[]
    OR?: RecommendationScalarWhereWithAggregatesInput[]
    NOT?: RecommendationScalarWhereWithAggregatesInput | RecommendationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Recommendation"> | number
    userId?: IntWithAggregatesFilter<"Recommendation"> | number
    checkinId?: IntWithAggregatesFilter<"Recommendation"> | number
    recommendationDate?: DateTimeWithAggregatesFilter<"Recommendation"> | Date | string
    outfits?: JsonWithAggregatesFilter<"Recommendation">
    makeup?: JsonWithAggregatesFilter<"Recommendation">
    music?: JsonWithAggregatesFilter<"Recommendation">
    feedbackPositive?: BoolNullableWithAggregatesFilter<"Recommendation"> | boolean | null
    createdAt?: DateTimeWithAggregatesFilter<"Recommendation"> | Date | string
  }

  export type StreakWhereInput = {
    AND?: StreakWhereInput | StreakWhereInput[]
    OR?: StreakWhereInput[]
    NOT?: StreakWhereInput | StreakWhereInput[]
    userId?: IntFilter<"Streak"> | number
    currentStreak?: IntFilter<"Streak"> | number
    maxStreak?: IntFilter<"Streak"> | number
    lastCheckinDate?: DateTimeNullableFilter<"Streak"> | Date | string | null
    weeklyFreezeUsedDate?: DateTimeNullableFilter<"Streak"> | Date | string | null
    updatedAt?: DateTimeFilter<"Streak"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type StreakOrderByWithRelationInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
    lastCheckinDate?: SortOrderInput | SortOrder
    weeklyFreezeUsedDate?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type StreakWhereUniqueInput = Prisma.AtLeast<{
    userId?: number
    AND?: StreakWhereInput | StreakWhereInput[]
    OR?: StreakWhereInput[]
    NOT?: StreakWhereInput | StreakWhereInput[]
    currentStreak?: IntFilter<"Streak"> | number
    maxStreak?: IntFilter<"Streak"> | number
    lastCheckinDate?: DateTimeNullableFilter<"Streak"> | Date | string | null
    weeklyFreezeUsedDate?: DateTimeNullableFilter<"Streak"> | Date | string | null
    updatedAt?: DateTimeFilter<"Streak"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "userId">

  export type StreakOrderByWithAggregationInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
    lastCheckinDate?: SortOrderInput | SortOrder
    weeklyFreezeUsedDate?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: StreakCountOrderByAggregateInput
    _avg?: StreakAvgOrderByAggregateInput
    _max?: StreakMaxOrderByAggregateInput
    _min?: StreakMinOrderByAggregateInput
    _sum?: StreakSumOrderByAggregateInput
  }

  export type StreakScalarWhereWithAggregatesInput = {
    AND?: StreakScalarWhereWithAggregatesInput | StreakScalarWhereWithAggregatesInput[]
    OR?: StreakScalarWhereWithAggregatesInput[]
    NOT?: StreakScalarWhereWithAggregatesInput | StreakScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"Streak"> | number
    currentStreak?: IntWithAggregatesFilter<"Streak"> | number
    maxStreak?: IntWithAggregatesFilter<"Streak"> | number
    lastCheckinDate?: DateTimeNullableWithAggregatesFilter<"Streak"> | Date | string | null
    weeklyFreezeUsedDate?: DateTimeNullableWithAggregatesFilter<"Streak"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Streak"> | Date | string
  }

  export type BadgeWhereInput = {
    AND?: BadgeWhereInput | BadgeWhereInput[]
    OR?: BadgeWhereInput[]
    NOT?: BadgeWhereInput | BadgeWhereInput[]
    id?: IntFilter<"Badge"> | number
    code?: StringFilter<"Badge"> | string
    name?: StringFilter<"Badge"> | string
    description?: StringFilter<"Badge"> | string
    criteria?: JsonFilter<"Badge">
    userBadges?: UserBadgeListRelationFilter
  }

  export type BadgeOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    criteria?: SortOrder
    userBadges?: UserBadgeOrderByRelationAggregateInput
  }

  export type BadgeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: BadgeWhereInput | BadgeWhereInput[]
    OR?: BadgeWhereInput[]
    NOT?: BadgeWhereInput | BadgeWhereInput[]
    name?: StringFilter<"Badge"> | string
    description?: StringFilter<"Badge"> | string
    criteria?: JsonFilter<"Badge">
    userBadges?: UserBadgeListRelationFilter
  }, "id" | "code">

  export type BadgeOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    criteria?: SortOrder
    _count?: BadgeCountOrderByAggregateInput
    _avg?: BadgeAvgOrderByAggregateInput
    _max?: BadgeMaxOrderByAggregateInput
    _min?: BadgeMinOrderByAggregateInput
    _sum?: BadgeSumOrderByAggregateInput
  }

  export type BadgeScalarWhereWithAggregatesInput = {
    AND?: BadgeScalarWhereWithAggregatesInput | BadgeScalarWhereWithAggregatesInput[]
    OR?: BadgeScalarWhereWithAggregatesInput[]
    NOT?: BadgeScalarWhereWithAggregatesInput | BadgeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Badge"> | number
    code?: StringWithAggregatesFilter<"Badge"> | string
    name?: StringWithAggregatesFilter<"Badge"> | string
    description?: StringWithAggregatesFilter<"Badge"> | string
    criteria?: JsonWithAggregatesFilter<"Badge">
  }

  export type UserBadgeWhereInput = {
    AND?: UserBadgeWhereInput | UserBadgeWhereInput[]
    OR?: UserBadgeWhereInput[]
    NOT?: UserBadgeWhereInput | UserBadgeWhereInput[]
    userId?: IntFilter<"UserBadge"> | number
    badgeId?: IntFilter<"UserBadge"> | number
    progress?: IntFilter<"UserBadge"> | number
    unlockedAt?: DateTimeNullableFilter<"UserBadge"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
  }

  export type UserBadgeOrderByWithRelationInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
    unlockedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    badge?: BadgeOrderByWithRelationInput
  }

  export type UserBadgeWhereUniqueInput = Prisma.AtLeast<{
    userId_badgeId?: UserBadgeUserIdBadgeIdCompoundUniqueInput
    AND?: UserBadgeWhereInput | UserBadgeWhereInput[]
    OR?: UserBadgeWhereInput[]
    NOT?: UserBadgeWhereInput | UserBadgeWhereInput[]
    userId?: IntFilter<"UserBadge"> | number
    badgeId?: IntFilter<"UserBadge"> | number
    progress?: IntFilter<"UserBadge"> | number
    unlockedAt?: DateTimeNullableFilter<"UserBadge"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
  }, "userId_badgeId">

  export type UserBadgeOrderByWithAggregationInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
    unlockedAt?: SortOrderInput | SortOrder
    _count?: UserBadgeCountOrderByAggregateInput
    _avg?: UserBadgeAvgOrderByAggregateInput
    _max?: UserBadgeMaxOrderByAggregateInput
    _min?: UserBadgeMinOrderByAggregateInput
    _sum?: UserBadgeSumOrderByAggregateInput
  }

  export type UserBadgeScalarWhereWithAggregatesInput = {
    AND?: UserBadgeScalarWhereWithAggregatesInput | UserBadgeScalarWhereWithAggregatesInput[]
    OR?: UserBadgeScalarWhereWithAggregatesInput[]
    NOT?: UserBadgeScalarWhereWithAggregatesInput | UserBadgeScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"UserBadge"> | number
    badgeId?: IntWithAggregatesFilter<"UserBadge"> | number
    progress?: IntWithAggregatesFilter<"UserBadge"> | number
    unlockedAt?: DateTimeNullableWithAggregatesFilter<"UserBadge"> | Date | string | null
  }

  export type UserCreateInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInCreateNestedManyWithoutUserInput
    recommendations?: RecommendationCreateNestedManyWithoutUserInput
    streak?: StreakCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInUncheckedCreateNestedManyWithoutUserInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutUserInput
    streak?: StreakUncheckedCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUpdateManyWithoutUserNestedInput
    streak?: StreakUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUncheckedUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutUserNestedInput
    streak?: StreakUncheckedUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePreferenceCreateInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfilePreferencesInput
  }

  export type ProfilePreferenceUncheckedCreateInput = {
    userId: number
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type ProfilePreferenceUpdateInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfilePreferencesNestedInput
  }

  export type ProfilePreferenceUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePreferenceCreateManyInput = {
    userId: number
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type ProfilePreferenceUpdateManyMutationInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePreferenceUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckInCreateInput = {
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutDailyCheckInsInput
    recommendations?: RecommendationCreateNestedManyWithoutDailyCheckInInput
  }

  export type DailyCheckInUncheckedCreateInput = {
    id?: number
    userId: number
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutDailyCheckInInput
  }

  export type DailyCheckInUpdateInput = {
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDailyCheckInsNestedInput
    recommendations?: RecommendationUpdateManyWithoutDailyCheckInNestedInput
  }

  export type DailyCheckInUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationUncheckedUpdateManyWithoutDailyCheckInNestedInput
  }

  export type DailyCheckInCreateManyInput = {
    id?: number
    userId: number
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
  }

  export type DailyCheckInUpdateManyMutationInput = {
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckInUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationCreateInput = {
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRecommendationsInput
    dailyCheckIn: DailyCheckInCreateNestedOneWithoutRecommendationsInput
  }

  export type RecommendationUncheckedCreateInput = {
    id?: number
    userId: number
    checkinId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type RecommendationUpdateInput = {
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRecommendationsNestedInput
    dailyCheckIn?: DailyCheckInUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type RecommendationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    checkinId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationCreateManyInput = {
    id?: number
    userId: number
    checkinId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type RecommendationUpdateManyMutationInput = {
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    checkinId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StreakCreateInput = {
    currentStreak?: number
    maxStreak?: number
    lastCheckinDate?: Date | string | null
    weeklyFreezeUsedDate?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStreakInput
  }

  export type StreakUncheckedCreateInput = {
    userId: number
    currentStreak?: number
    maxStreak?: number
    lastCheckinDate?: Date | string | null
    weeklyFreezeUsedDate?: Date | string | null
    updatedAt?: Date | string
  }

  export type StreakUpdateInput = {
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStreakNestedInput
  }

  export type StreakUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StreakCreateManyInput = {
    userId: number
    currentStreak?: number
    maxStreak?: number
    lastCheckinDate?: Date | string | null
    weeklyFreezeUsedDate?: Date | string | null
    updatedAt?: Date | string
  }

  export type StreakUpdateManyMutationInput = {
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StreakUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeCreateInput = {
    code: string
    name: string
    description: string
    criteria: JsonNullValueInput | InputJsonValue
    userBadges?: UserBadgeCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    description: string
    criteria: JsonNullValueInput | InputJsonValue
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
    userBadges?: UserBadgeUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
    userBadges?: UserBadgeUncheckedUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeCreateManyInput = {
    id?: number
    code: string
    name: string
    description: string
    criteria: JsonNullValueInput | InputJsonValue
  }

  export type BadgeUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
  }

  export type BadgeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
  }

  export type UserBadgeCreateInput = {
    progress?: number
    unlockedAt?: Date | string | null
    user: UserCreateNestedOneWithoutUserBadgesInput
    badge: BadgeCreateNestedOneWithoutUserBadgesInput
  }

  export type UserBadgeUncheckedCreateInput = {
    userId: number
    badgeId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type UserBadgeUpdateInput = {
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutUserBadgesNestedInput
    badge?: BadgeUpdateOneRequiredWithoutUserBadgesNestedInput
  }

  export type UserBadgeUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    badgeId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserBadgeCreateManyInput = {
    userId: number
    badgeId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type UserBadgeUpdateManyMutationInput = {
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserBadgeUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    badgeId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProfilePreferenceNullableScalarRelationFilter = {
    is?: ProfilePreferenceWhereInput | null
    isNot?: ProfilePreferenceWhereInput | null
  }

  export type DailyCheckInListRelationFilter = {
    every?: DailyCheckInWhereInput
    some?: DailyCheckInWhereInput
    none?: DailyCheckInWhereInput
  }

  export type RecommendationListRelationFilter = {
    every?: RecommendationWhereInput
    some?: RecommendationWhereInput
    none?: RecommendationWhereInput
  }

  export type StreakNullableScalarRelationFilter = {
    is?: StreakWhereInput | null
    isNot?: StreakWhereInput | null
  }

  export type UserBadgeListRelationFilter = {
    every?: UserBadgeWhereInput
    some?: UserBadgeWhereInput
    none?: UserBadgeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DailyCheckInOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecommendationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserBadgeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    gender?: SortOrder
    age?: SortOrder
    height?: SortOrder
    origin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    age?: SortOrder
    height?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    gender?: SortOrder
    age?: SortOrder
    height?: SortOrder
    origin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    gender?: SortOrder
    age?: SortOrder
    height?: SortOrder
    origin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    age?: SortOrder
    height?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProfilePreferenceCountOrderByAggregateInput = {
    userId?: SortOrder
    styleTags?: SortOrder
    colorPreferences?: SortOrder
    musicPreferences?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfilePreferenceAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ProfilePreferenceMaxOrderByAggregateInput = {
    userId?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfilePreferenceMinOrderByAggregateInput = {
    userId?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfilePreferenceSumOrderByAggregateInput = {
    userId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DailyCheckInUserIdCheckinDateCompoundUniqueInput = {
    userId: number
    checkinDate: Date | string
  }

  export type DailyCheckInCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinDate?: SortOrder
    moodDetected?: SortOrder
    moodSelected?: SortOrder
    answers?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyCheckInAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type DailyCheckInMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinDate?: SortOrder
    moodDetected?: SortOrder
    moodSelected?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyCheckInMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinDate?: SortOrder
    moodDetected?: SortOrder
    moodSelected?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyCheckInSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DailyCheckInScalarRelationFilter = {
    is?: DailyCheckInWhereInput
    isNot?: DailyCheckInWhereInput
  }

  export type RecommendationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
    recommendationDate?: SortOrder
    outfits?: SortOrder
    makeup?: SortOrder
    music?: SortOrder
    feedbackPositive?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
  }

  export type RecommendationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
    recommendationDate?: SortOrder
    feedbackPositive?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
    recommendationDate?: SortOrder
    feedbackPositive?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    checkinId?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StreakCountOrderByAggregateInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
    lastCheckinDate?: SortOrder
    weeklyFreezeUsedDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type StreakAvgOrderByAggregateInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
  }

  export type StreakMaxOrderByAggregateInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
    lastCheckinDate?: SortOrder
    weeklyFreezeUsedDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type StreakMinOrderByAggregateInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
    lastCheckinDate?: SortOrder
    weeklyFreezeUsedDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type StreakSumOrderByAggregateInput = {
    userId?: SortOrder
    currentStreak?: SortOrder
    maxStreak?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BadgeCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    criteria?: SortOrder
  }

  export type BadgeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BadgeMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type BadgeMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type BadgeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BadgeScalarRelationFilter = {
    is?: BadgeWhereInput
    isNot?: BadgeWhereInput
  }

  export type UserBadgeUserIdBadgeIdCompoundUniqueInput = {
    userId: number
    badgeId: number
  }

  export type UserBadgeCountOrderByAggregateInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
    unlockedAt?: SortOrder
  }

  export type UserBadgeAvgOrderByAggregateInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
  }

  export type UserBadgeMaxOrderByAggregateInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
    unlockedAt?: SortOrder
  }

  export type UserBadgeMinOrderByAggregateInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
    unlockedAt?: SortOrder
  }

  export type UserBadgeSumOrderByAggregateInput = {
    userId?: SortOrder
    badgeId?: SortOrder
    progress?: SortOrder
  }

  export type ProfilePreferenceCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfilePreferenceCreateOrConnectWithoutUserInput
    connect?: ProfilePreferenceWhereUniqueInput
  }

  export type DailyCheckInCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput> | DailyCheckInCreateWithoutUserInput[] | DailyCheckInUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutUserInput | DailyCheckInCreateOrConnectWithoutUserInput[]
    createMany?: DailyCheckInCreateManyUserInputEnvelope
    connect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
  }

  export type RecommendationCreateNestedManyWithoutUserInput = {
    create?: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput> | RecommendationCreateWithoutUserInput[] | RecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutUserInput | RecommendationCreateOrConnectWithoutUserInput[]
    createMany?: RecommendationCreateManyUserInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type StreakCreateNestedOneWithoutUserInput = {
    create?: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
    connectOrCreate?: StreakCreateOrConnectWithoutUserInput
    connect?: StreakWhereUniqueInput
  }

  export type UserBadgeCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfilePreferenceCreateOrConnectWithoutUserInput
    connect?: ProfilePreferenceWhereUniqueInput
  }

  export type DailyCheckInUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput> | DailyCheckInCreateWithoutUserInput[] | DailyCheckInUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutUserInput | DailyCheckInCreateOrConnectWithoutUserInput[]
    createMany?: DailyCheckInCreateManyUserInputEnvelope
    connect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
  }

  export type RecommendationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput> | RecommendationCreateWithoutUserInput[] | RecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutUserInput | RecommendationCreateOrConnectWithoutUserInput[]
    createMany?: RecommendationCreateManyUserInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type StreakUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
    connectOrCreate?: StreakCreateOrConnectWithoutUserInput
    connect?: StreakWhereUniqueInput
  }

  export type UserBadgeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProfilePreferenceUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfilePreferenceCreateOrConnectWithoutUserInput
    upsert?: ProfilePreferenceUpsertWithoutUserInput
    disconnect?: ProfilePreferenceWhereInput | boolean
    delete?: ProfilePreferenceWhereInput | boolean
    connect?: ProfilePreferenceWhereUniqueInput
    update?: XOR<XOR<ProfilePreferenceUpdateToOneWithWhereWithoutUserInput, ProfilePreferenceUpdateWithoutUserInput>, ProfilePreferenceUncheckedUpdateWithoutUserInput>
  }

  export type DailyCheckInUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput> | DailyCheckInCreateWithoutUserInput[] | DailyCheckInUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutUserInput | DailyCheckInCreateOrConnectWithoutUserInput[]
    upsert?: DailyCheckInUpsertWithWhereUniqueWithoutUserInput | DailyCheckInUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyCheckInCreateManyUserInputEnvelope
    set?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    disconnect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    delete?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    connect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    update?: DailyCheckInUpdateWithWhereUniqueWithoutUserInput | DailyCheckInUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyCheckInUpdateManyWithWhereWithoutUserInput | DailyCheckInUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyCheckInScalarWhereInput | DailyCheckInScalarWhereInput[]
  }

  export type RecommendationUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput> | RecommendationCreateWithoutUserInput[] | RecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutUserInput | RecommendationCreateOrConnectWithoutUserInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutUserInput | RecommendationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecommendationCreateManyUserInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutUserInput | RecommendationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutUserInput | RecommendationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type StreakUpdateOneWithoutUserNestedInput = {
    create?: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
    connectOrCreate?: StreakCreateOrConnectWithoutUserInput
    upsert?: StreakUpsertWithoutUserInput
    disconnect?: StreakWhereInput | boolean
    delete?: StreakWhereInput | boolean
    connect?: StreakWhereUniqueInput
    update?: XOR<XOR<StreakUpdateToOneWithWhereWithoutUserInput, StreakUpdateWithoutUserInput>, StreakUncheckedUpdateWithoutUserInput>
  }

  export type UserBadgeUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutUserInput | UserBadgeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutUserInput | UserBadgeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutUserInput | UserBadgeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfilePreferenceCreateOrConnectWithoutUserInput
    upsert?: ProfilePreferenceUpsertWithoutUserInput
    disconnect?: ProfilePreferenceWhereInput | boolean
    delete?: ProfilePreferenceWhereInput | boolean
    connect?: ProfilePreferenceWhereUniqueInput
    update?: XOR<XOR<ProfilePreferenceUpdateToOneWithWhereWithoutUserInput, ProfilePreferenceUpdateWithoutUserInput>, ProfilePreferenceUncheckedUpdateWithoutUserInput>
  }

  export type DailyCheckInUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput> | DailyCheckInCreateWithoutUserInput[] | DailyCheckInUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutUserInput | DailyCheckInCreateOrConnectWithoutUserInput[]
    upsert?: DailyCheckInUpsertWithWhereUniqueWithoutUserInput | DailyCheckInUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyCheckInCreateManyUserInputEnvelope
    set?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    disconnect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    delete?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    connect?: DailyCheckInWhereUniqueInput | DailyCheckInWhereUniqueInput[]
    update?: DailyCheckInUpdateWithWhereUniqueWithoutUserInput | DailyCheckInUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyCheckInUpdateManyWithWhereWithoutUserInput | DailyCheckInUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyCheckInScalarWhereInput | DailyCheckInScalarWhereInput[]
  }

  export type RecommendationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput> | RecommendationCreateWithoutUserInput[] | RecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutUserInput | RecommendationCreateOrConnectWithoutUserInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutUserInput | RecommendationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecommendationCreateManyUserInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutUserInput | RecommendationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutUserInput | RecommendationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type StreakUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
    connectOrCreate?: StreakCreateOrConnectWithoutUserInput
    upsert?: StreakUpsertWithoutUserInput
    disconnect?: StreakWhereInput | boolean
    delete?: StreakWhereInput | boolean
    connect?: StreakWhereUniqueInput
    update?: XOR<XOR<StreakUpdateToOneWithWhereWithoutUserInput, StreakUpdateWithoutUserInput>, StreakUncheckedUpdateWithoutUserInput>
  }

  export type UserBadgeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutUserInput | UserBadgeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutUserInput | UserBadgeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutUserInput | UserBadgeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProfilePreferencesInput = {
    create?: XOR<UserCreateWithoutProfilePreferencesInput, UserUncheckedCreateWithoutProfilePreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfilePreferencesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProfilePreferencesNestedInput = {
    create?: XOR<UserCreateWithoutProfilePreferencesInput, UserUncheckedCreateWithoutProfilePreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfilePreferencesInput
    upsert?: UserUpsertWithoutProfilePreferencesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfilePreferencesInput, UserUpdateWithoutProfilePreferencesInput>, UserUncheckedUpdateWithoutProfilePreferencesInput>
  }

  export type UserCreateNestedOneWithoutDailyCheckInsInput = {
    create?: XOR<UserCreateWithoutDailyCheckInsInput, UserUncheckedCreateWithoutDailyCheckInsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyCheckInsInput
    connect?: UserWhereUniqueInput
  }

  export type RecommendationCreateNestedManyWithoutDailyCheckInInput = {
    create?: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput> | RecommendationCreateWithoutDailyCheckInInput[] | RecommendationUncheckedCreateWithoutDailyCheckInInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutDailyCheckInInput | RecommendationCreateOrConnectWithoutDailyCheckInInput[]
    createMany?: RecommendationCreateManyDailyCheckInInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type RecommendationUncheckedCreateNestedManyWithoutDailyCheckInInput = {
    create?: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput> | RecommendationCreateWithoutDailyCheckInInput[] | RecommendationUncheckedCreateWithoutDailyCheckInInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutDailyCheckInInput | RecommendationCreateOrConnectWithoutDailyCheckInInput[]
    createMany?: RecommendationCreateManyDailyCheckInInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutDailyCheckInsNestedInput = {
    create?: XOR<UserCreateWithoutDailyCheckInsInput, UserUncheckedCreateWithoutDailyCheckInsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyCheckInsInput
    upsert?: UserUpsertWithoutDailyCheckInsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDailyCheckInsInput, UserUpdateWithoutDailyCheckInsInput>, UserUncheckedUpdateWithoutDailyCheckInsInput>
  }

  export type RecommendationUpdateManyWithoutDailyCheckInNestedInput = {
    create?: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput> | RecommendationCreateWithoutDailyCheckInInput[] | RecommendationUncheckedCreateWithoutDailyCheckInInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutDailyCheckInInput | RecommendationCreateOrConnectWithoutDailyCheckInInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutDailyCheckInInput | RecommendationUpsertWithWhereUniqueWithoutDailyCheckInInput[]
    createMany?: RecommendationCreateManyDailyCheckInInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutDailyCheckInInput | RecommendationUpdateWithWhereUniqueWithoutDailyCheckInInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutDailyCheckInInput | RecommendationUpdateManyWithWhereWithoutDailyCheckInInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type RecommendationUncheckedUpdateManyWithoutDailyCheckInNestedInput = {
    create?: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput> | RecommendationCreateWithoutDailyCheckInInput[] | RecommendationUncheckedCreateWithoutDailyCheckInInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutDailyCheckInInput | RecommendationCreateOrConnectWithoutDailyCheckInInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutDailyCheckInInput | RecommendationUpsertWithWhereUniqueWithoutDailyCheckInInput[]
    createMany?: RecommendationCreateManyDailyCheckInInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutDailyCheckInInput | RecommendationUpdateWithWhereUniqueWithoutDailyCheckInInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutDailyCheckInInput | RecommendationUpdateManyWithWhereWithoutDailyCheckInInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRecommendationsInput = {
    create?: XOR<UserCreateWithoutRecommendationsInput, UserUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRecommendationsInput
    connect?: UserWhereUniqueInput
  }

  export type DailyCheckInCreateNestedOneWithoutRecommendationsInput = {
    create?: XOR<DailyCheckInCreateWithoutRecommendationsInput, DailyCheckInUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutRecommendationsInput
    connect?: DailyCheckInWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type UserUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: XOR<UserCreateWithoutRecommendationsInput, UserUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRecommendationsInput
    upsert?: UserUpsertWithoutRecommendationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRecommendationsInput, UserUpdateWithoutRecommendationsInput>, UserUncheckedUpdateWithoutRecommendationsInput>
  }

  export type DailyCheckInUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: XOR<DailyCheckInCreateWithoutRecommendationsInput, DailyCheckInUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: DailyCheckInCreateOrConnectWithoutRecommendationsInput
    upsert?: DailyCheckInUpsertWithoutRecommendationsInput
    connect?: DailyCheckInWhereUniqueInput
    update?: XOR<XOR<DailyCheckInUpdateToOneWithWhereWithoutRecommendationsInput, DailyCheckInUpdateWithoutRecommendationsInput>, DailyCheckInUncheckedUpdateWithoutRecommendationsInput>
  }

  export type UserCreateNestedOneWithoutStreakInput = {
    create?: XOR<UserCreateWithoutStreakInput, UserUncheckedCreateWithoutStreakInput>
    connectOrCreate?: UserCreateOrConnectWithoutStreakInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutStreakNestedInput = {
    create?: XOR<UserCreateWithoutStreakInput, UserUncheckedCreateWithoutStreakInput>
    connectOrCreate?: UserCreateOrConnectWithoutStreakInput
    upsert?: UserUpsertWithoutStreakInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStreakInput, UserUpdateWithoutStreakInput>, UserUncheckedUpdateWithoutStreakInput>
  }

  export type UserBadgeCreateNestedManyWithoutBadgeInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type UserBadgeUncheckedCreateNestedManyWithoutBadgeInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type UserBadgeUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutBadgeInput | UserBadgeUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutBadgeInput | UserBadgeUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutBadgeInput | UserBadgeUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type UserBadgeUncheckedUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutBadgeInput | UserBadgeUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutBadgeInput | UserBadgeUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutBadgeInput | UserBadgeUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserBadgesInput = {
    create?: XOR<UserCreateWithoutUserBadgesInput, UserUncheckedCreateWithoutUserBadgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserBadgesInput
    connect?: UserWhereUniqueInput
  }

  export type BadgeCreateNestedOneWithoutUserBadgesInput = {
    create?: XOR<BadgeCreateWithoutUserBadgesInput, BadgeUncheckedCreateWithoutUserBadgesInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutUserBadgesInput
    connect?: BadgeWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserBadgesNestedInput = {
    create?: XOR<UserCreateWithoutUserBadgesInput, UserUncheckedCreateWithoutUserBadgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserBadgesInput
    upsert?: UserUpsertWithoutUserBadgesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserBadgesInput, UserUpdateWithoutUserBadgesInput>, UserUncheckedUpdateWithoutUserBadgesInput>
  }

  export type BadgeUpdateOneRequiredWithoutUserBadgesNestedInput = {
    create?: XOR<BadgeCreateWithoutUserBadgesInput, BadgeUncheckedCreateWithoutUserBadgesInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutUserBadgesInput
    upsert?: BadgeUpsertWithoutUserBadgesInput
    connect?: BadgeWhereUniqueInput
    update?: XOR<XOR<BadgeUpdateToOneWithWhereWithoutUserBadgesInput, BadgeUpdateWithoutUserBadgesInput>, BadgeUncheckedUpdateWithoutUserBadgesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProfilePreferenceCreateWithoutUserInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type ProfilePreferenceUncheckedCreateWithoutUserInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type ProfilePreferenceCreateOrConnectWithoutUserInput = {
    where: ProfilePreferenceWhereUniqueInput
    create: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
  }

  export type DailyCheckInCreateWithoutUserInput = {
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    recommendations?: RecommendationCreateNestedManyWithoutDailyCheckInInput
  }

  export type DailyCheckInUncheckedCreateWithoutUserInput = {
    id?: number
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutDailyCheckInInput
  }

  export type DailyCheckInCreateOrConnectWithoutUserInput = {
    where: DailyCheckInWhereUniqueInput
    create: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput>
  }

  export type DailyCheckInCreateManyUserInputEnvelope = {
    data: DailyCheckInCreateManyUserInput | DailyCheckInCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RecommendationCreateWithoutUserInput = {
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
    dailyCheckIn: DailyCheckInCreateNestedOneWithoutRecommendationsInput
  }

  export type RecommendationUncheckedCreateWithoutUserInput = {
    id?: number
    checkinId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type RecommendationCreateOrConnectWithoutUserInput = {
    where: RecommendationWhereUniqueInput
    create: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput>
  }

  export type RecommendationCreateManyUserInputEnvelope = {
    data: RecommendationCreateManyUserInput | RecommendationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StreakCreateWithoutUserInput = {
    currentStreak?: number
    maxStreak?: number
    lastCheckinDate?: Date | string | null
    weeklyFreezeUsedDate?: Date | string | null
    updatedAt?: Date | string
  }

  export type StreakUncheckedCreateWithoutUserInput = {
    currentStreak?: number
    maxStreak?: number
    lastCheckinDate?: Date | string | null
    weeklyFreezeUsedDate?: Date | string | null
    updatedAt?: Date | string
  }

  export type StreakCreateOrConnectWithoutUserInput = {
    where: StreakWhereUniqueInput
    create: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
  }

  export type UserBadgeCreateWithoutUserInput = {
    progress?: number
    unlockedAt?: Date | string | null
    badge: BadgeCreateNestedOneWithoutUserBadgesInput
  }

  export type UserBadgeUncheckedCreateWithoutUserInput = {
    badgeId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type UserBadgeCreateOrConnectWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    create: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput>
  }

  export type UserBadgeCreateManyUserInputEnvelope = {
    data: UserBadgeCreateManyUserInput | UserBadgeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProfilePreferenceUpsertWithoutUserInput = {
    update: XOR<ProfilePreferenceUpdateWithoutUserInput, ProfilePreferenceUncheckedUpdateWithoutUserInput>
    create: XOR<ProfilePreferenceCreateWithoutUserInput, ProfilePreferenceUncheckedCreateWithoutUserInput>
    where?: ProfilePreferenceWhereInput
  }

  export type ProfilePreferenceUpdateToOneWithWhereWithoutUserInput = {
    where?: ProfilePreferenceWhereInput
    data: XOR<ProfilePreferenceUpdateWithoutUserInput, ProfilePreferenceUncheckedUpdateWithoutUserInput>
  }

  export type ProfilePreferenceUpdateWithoutUserInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePreferenceUncheckedUpdateWithoutUserInput = {
    styleTags?: JsonNullValueInput | InputJsonValue
    colorPreferences?: JsonNullValueInput | InputJsonValue
    musicPreferences?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckInUpsertWithWhereUniqueWithoutUserInput = {
    where: DailyCheckInWhereUniqueInput
    update: XOR<DailyCheckInUpdateWithoutUserInput, DailyCheckInUncheckedUpdateWithoutUserInput>
    create: XOR<DailyCheckInCreateWithoutUserInput, DailyCheckInUncheckedCreateWithoutUserInput>
  }

  export type DailyCheckInUpdateWithWhereUniqueWithoutUserInput = {
    where: DailyCheckInWhereUniqueInput
    data: XOR<DailyCheckInUpdateWithoutUserInput, DailyCheckInUncheckedUpdateWithoutUserInput>
  }

  export type DailyCheckInUpdateManyWithWhereWithoutUserInput = {
    where: DailyCheckInScalarWhereInput
    data: XOR<DailyCheckInUpdateManyMutationInput, DailyCheckInUncheckedUpdateManyWithoutUserInput>
  }

  export type DailyCheckInScalarWhereInput = {
    AND?: DailyCheckInScalarWhereInput | DailyCheckInScalarWhereInput[]
    OR?: DailyCheckInScalarWhereInput[]
    NOT?: DailyCheckInScalarWhereInput | DailyCheckInScalarWhereInput[]
    id?: IntFilter<"DailyCheckIn"> | number
    userId?: IntFilter<"DailyCheckIn"> | number
    checkinDate?: DateTimeFilter<"DailyCheckIn"> | Date | string
    moodDetected?: StringFilter<"DailyCheckIn"> | string
    moodSelected?: StringFilter<"DailyCheckIn"> | string
    answers?: JsonFilter<"DailyCheckIn">
    imageUrl?: StringNullableFilter<"DailyCheckIn"> | string | null
    createdAt?: DateTimeFilter<"DailyCheckIn"> | Date | string
  }

  export type RecommendationUpsertWithWhereUniqueWithoutUserInput = {
    where: RecommendationWhereUniqueInput
    update: XOR<RecommendationUpdateWithoutUserInput, RecommendationUncheckedUpdateWithoutUserInput>
    create: XOR<RecommendationCreateWithoutUserInput, RecommendationUncheckedCreateWithoutUserInput>
  }

  export type RecommendationUpdateWithWhereUniqueWithoutUserInput = {
    where: RecommendationWhereUniqueInput
    data: XOR<RecommendationUpdateWithoutUserInput, RecommendationUncheckedUpdateWithoutUserInput>
  }

  export type RecommendationUpdateManyWithWhereWithoutUserInput = {
    where: RecommendationScalarWhereInput
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyWithoutUserInput>
  }

  export type RecommendationScalarWhereInput = {
    AND?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
    OR?: RecommendationScalarWhereInput[]
    NOT?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
    id?: IntFilter<"Recommendation"> | number
    userId?: IntFilter<"Recommendation"> | number
    checkinId?: IntFilter<"Recommendation"> | number
    recommendationDate?: DateTimeFilter<"Recommendation"> | Date | string
    outfits?: JsonFilter<"Recommendation">
    makeup?: JsonFilter<"Recommendation">
    music?: JsonFilter<"Recommendation">
    feedbackPositive?: BoolNullableFilter<"Recommendation"> | boolean | null
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
  }

  export type StreakUpsertWithoutUserInput = {
    update: XOR<StreakUpdateWithoutUserInput, StreakUncheckedUpdateWithoutUserInput>
    create: XOR<StreakCreateWithoutUserInput, StreakUncheckedCreateWithoutUserInput>
    where?: StreakWhereInput
  }

  export type StreakUpdateToOneWithWhereWithoutUserInput = {
    where?: StreakWhereInput
    data: XOR<StreakUpdateWithoutUserInput, StreakUncheckedUpdateWithoutUserInput>
  }

  export type StreakUpdateWithoutUserInput = {
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StreakUncheckedUpdateWithoutUserInput = {
    currentStreak?: IntFieldUpdateOperationsInput | number
    maxStreak?: IntFieldUpdateOperationsInput | number
    lastCheckinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weeklyFreezeUsedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBadgeUpsertWithWhereUniqueWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    update: XOR<UserBadgeUpdateWithoutUserInput, UserBadgeUncheckedUpdateWithoutUserInput>
    create: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput>
  }

  export type UserBadgeUpdateWithWhereUniqueWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    data: XOR<UserBadgeUpdateWithoutUserInput, UserBadgeUncheckedUpdateWithoutUserInput>
  }

  export type UserBadgeUpdateManyWithWhereWithoutUserInput = {
    where: UserBadgeScalarWhereInput
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyWithoutUserInput>
  }

  export type UserBadgeScalarWhereInput = {
    AND?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
    OR?: UserBadgeScalarWhereInput[]
    NOT?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
    userId?: IntFilter<"UserBadge"> | number
    badgeId?: IntFilter<"UserBadge"> | number
    progress?: IntFilter<"UserBadge"> | number
    unlockedAt?: DateTimeNullableFilter<"UserBadge"> | Date | string | null
  }

  export type UserCreateWithoutProfilePreferencesInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dailyCheckIns?: DailyCheckInCreateNestedManyWithoutUserInput
    recommendations?: RecommendationCreateNestedManyWithoutUserInput
    streak?: StreakCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfilePreferencesInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dailyCheckIns?: DailyCheckInUncheckedCreateNestedManyWithoutUserInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutUserInput
    streak?: StreakUncheckedCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfilePreferencesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfilePreferencesInput, UserUncheckedCreateWithoutProfilePreferencesInput>
  }

  export type UserUpsertWithoutProfilePreferencesInput = {
    update: XOR<UserUpdateWithoutProfilePreferencesInput, UserUncheckedUpdateWithoutProfilePreferencesInput>
    create: XOR<UserCreateWithoutProfilePreferencesInput, UserUncheckedCreateWithoutProfilePreferencesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfilePreferencesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfilePreferencesInput, UserUncheckedUpdateWithoutProfilePreferencesInput>
  }

  export type UserUpdateWithoutProfilePreferencesInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyCheckIns?: DailyCheckInUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUpdateManyWithoutUserNestedInput
    streak?: StreakUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfilePreferencesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyCheckIns?: DailyCheckInUncheckedUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutUserNestedInput
    streak?: StreakUncheckedUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDailyCheckInsInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceCreateNestedOneWithoutUserInput
    recommendations?: RecommendationCreateNestedManyWithoutUserInput
    streak?: StreakCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDailyCheckInsInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutUserInput
    streak?: StreakUncheckedCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDailyCheckInsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDailyCheckInsInput, UserUncheckedCreateWithoutDailyCheckInsInput>
  }

  export type RecommendationCreateWithoutDailyCheckInInput = {
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRecommendationsInput
  }

  export type RecommendationUncheckedCreateWithoutDailyCheckInInput = {
    id?: number
    userId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type RecommendationCreateOrConnectWithoutDailyCheckInInput = {
    where: RecommendationWhereUniqueInput
    create: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput>
  }

  export type RecommendationCreateManyDailyCheckInInputEnvelope = {
    data: RecommendationCreateManyDailyCheckInInput | RecommendationCreateManyDailyCheckInInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutDailyCheckInsInput = {
    update: XOR<UserUpdateWithoutDailyCheckInsInput, UserUncheckedUpdateWithoutDailyCheckInsInput>
    create: XOR<UserCreateWithoutDailyCheckInsInput, UserUncheckedCreateWithoutDailyCheckInsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDailyCheckInsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDailyCheckInsInput, UserUncheckedUpdateWithoutDailyCheckInsInput>
  }

  export type UserUpdateWithoutDailyCheckInsInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUpdateOneWithoutUserNestedInput
    recommendations?: RecommendationUpdateManyWithoutUserNestedInput
    streak?: StreakUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDailyCheckInsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutUserNestedInput
    streak?: StreakUncheckedUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RecommendationUpsertWithWhereUniqueWithoutDailyCheckInInput = {
    where: RecommendationWhereUniqueInput
    update: XOR<RecommendationUpdateWithoutDailyCheckInInput, RecommendationUncheckedUpdateWithoutDailyCheckInInput>
    create: XOR<RecommendationCreateWithoutDailyCheckInInput, RecommendationUncheckedCreateWithoutDailyCheckInInput>
  }

  export type RecommendationUpdateWithWhereUniqueWithoutDailyCheckInInput = {
    where: RecommendationWhereUniqueInput
    data: XOR<RecommendationUpdateWithoutDailyCheckInInput, RecommendationUncheckedUpdateWithoutDailyCheckInInput>
  }

  export type RecommendationUpdateManyWithWhereWithoutDailyCheckInInput = {
    where: RecommendationScalarWhereInput
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyWithoutDailyCheckInInput>
  }

  export type UserCreateWithoutRecommendationsInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInCreateNestedManyWithoutUserInput
    streak?: StreakCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRecommendationsInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInUncheckedCreateNestedManyWithoutUserInput
    streak?: StreakUncheckedCreateNestedOneWithoutUserInput
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRecommendationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRecommendationsInput, UserUncheckedCreateWithoutRecommendationsInput>
  }

  export type DailyCheckInCreateWithoutRecommendationsInput = {
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutDailyCheckInsInput
  }

  export type DailyCheckInUncheckedCreateWithoutRecommendationsInput = {
    id?: number
    userId: number
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
  }

  export type DailyCheckInCreateOrConnectWithoutRecommendationsInput = {
    where: DailyCheckInWhereUniqueInput
    create: XOR<DailyCheckInCreateWithoutRecommendationsInput, DailyCheckInUncheckedCreateWithoutRecommendationsInput>
  }

  export type UserUpsertWithoutRecommendationsInput = {
    update: XOR<UserUpdateWithoutRecommendationsInput, UserUncheckedUpdateWithoutRecommendationsInput>
    create: XOR<UserCreateWithoutRecommendationsInput, UserUncheckedCreateWithoutRecommendationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRecommendationsInput, UserUncheckedUpdateWithoutRecommendationsInput>
  }

  export type UserUpdateWithoutRecommendationsInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUpdateManyWithoutUserNestedInput
    streak?: StreakUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRecommendationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUncheckedUpdateManyWithoutUserNestedInput
    streak?: StreakUncheckedUpdateOneWithoutUserNestedInput
    userBadges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DailyCheckInUpsertWithoutRecommendationsInput = {
    update: XOR<DailyCheckInUpdateWithoutRecommendationsInput, DailyCheckInUncheckedUpdateWithoutRecommendationsInput>
    create: XOR<DailyCheckInCreateWithoutRecommendationsInput, DailyCheckInUncheckedCreateWithoutRecommendationsInput>
    where?: DailyCheckInWhereInput
  }

  export type DailyCheckInUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: DailyCheckInWhereInput
    data: XOR<DailyCheckInUpdateWithoutRecommendationsInput, DailyCheckInUncheckedUpdateWithoutRecommendationsInput>
  }

  export type DailyCheckInUpdateWithoutRecommendationsInput = {
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDailyCheckInsNestedInput
  }

  export type DailyCheckInUncheckedUpdateWithoutRecommendationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutStreakInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInCreateNestedManyWithoutUserInput
    recommendations?: RecommendationCreateNestedManyWithoutUserInput
    userBadges?: UserBadgeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStreakInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInUncheckedCreateNestedManyWithoutUserInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutUserInput
    userBadges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStreakInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStreakInput, UserUncheckedCreateWithoutStreakInput>
  }

  export type UserUpsertWithoutStreakInput = {
    update: XOR<UserUpdateWithoutStreakInput, UserUncheckedUpdateWithoutStreakInput>
    create: XOR<UserCreateWithoutStreakInput, UserUncheckedCreateWithoutStreakInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStreakInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStreakInput, UserUncheckedUpdateWithoutStreakInput>
  }

  export type UserUpdateWithoutStreakInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUpdateManyWithoutUserNestedInput
    userBadges?: UserBadgeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStreakInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUncheckedUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutUserNestedInput
    userBadges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserBadgeCreateWithoutBadgeInput = {
    progress?: number
    unlockedAt?: Date | string | null
    user: UserCreateNestedOneWithoutUserBadgesInput
  }

  export type UserBadgeUncheckedCreateWithoutBadgeInput = {
    userId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type UserBadgeCreateOrConnectWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    create: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput>
  }

  export type UserBadgeCreateManyBadgeInputEnvelope = {
    data: UserBadgeCreateManyBadgeInput | UserBadgeCreateManyBadgeInput[]
    skipDuplicates?: boolean
  }

  export type UserBadgeUpsertWithWhereUniqueWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    update: XOR<UserBadgeUpdateWithoutBadgeInput, UserBadgeUncheckedUpdateWithoutBadgeInput>
    create: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput>
  }

  export type UserBadgeUpdateWithWhereUniqueWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    data: XOR<UserBadgeUpdateWithoutBadgeInput, UserBadgeUncheckedUpdateWithoutBadgeInput>
  }

  export type UserBadgeUpdateManyWithWhereWithoutBadgeInput = {
    where: UserBadgeScalarWhereInput
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyWithoutBadgeInput>
  }

  export type UserCreateWithoutUserBadgesInput = {
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInCreateNestedManyWithoutUserInput
    recommendations?: RecommendationCreateNestedManyWithoutUserInput
    streak?: StreakCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserBadgesInput = {
    id?: number
    email: string
    passwordHash: string
    displayName: string
    gender: string
    age: number
    height?: number | null
    origin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profilePreferences?: ProfilePreferenceUncheckedCreateNestedOneWithoutUserInput
    dailyCheckIns?: DailyCheckInUncheckedCreateNestedManyWithoutUserInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutUserInput
    streak?: StreakUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserBadgesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserBadgesInput, UserUncheckedCreateWithoutUserBadgesInput>
  }

  export type BadgeCreateWithoutUserBadgesInput = {
    code: string
    name: string
    description: string
    criteria: JsonNullValueInput | InputJsonValue
  }

  export type BadgeUncheckedCreateWithoutUserBadgesInput = {
    id?: number
    code: string
    name: string
    description: string
    criteria: JsonNullValueInput | InputJsonValue
  }

  export type BadgeCreateOrConnectWithoutUserBadgesInput = {
    where: BadgeWhereUniqueInput
    create: XOR<BadgeCreateWithoutUserBadgesInput, BadgeUncheckedCreateWithoutUserBadgesInput>
  }

  export type UserUpsertWithoutUserBadgesInput = {
    update: XOR<UserUpdateWithoutUserBadgesInput, UserUncheckedUpdateWithoutUserBadgesInput>
    create: XOR<UserCreateWithoutUserBadgesInput, UserUncheckedCreateWithoutUserBadgesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserBadgesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserBadgesInput, UserUncheckedUpdateWithoutUserBadgesInput>
  }

  export type UserUpdateWithoutUserBadgesInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUpdateManyWithoutUserNestedInput
    streak?: StreakUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserBadgesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    age?: IntFieldUpdateOperationsInput | number
    height?: NullableIntFieldUpdateOperationsInput | number | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profilePreferences?: ProfilePreferenceUncheckedUpdateOneWithoutUserNestedInput
    dailyCheckIns?: DailyCheckInUncheckedUpdateManyWithoutUserNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutUserNestedInput
    streak?: StreakUncheckedUpdateOneWithoutUserNestedInput
  }

  export type BadgeUpsertWithoutUserBadgesInput = {
    update: XOR<BadgeUpdateWithoutUserBadgesInput, BadgeUncheckedUpdateWithoutUserBadgesInput>
    create: XOR<BadgeCreateWithoutUserBadgesInput, BadgeUncheckedCreateWithoutUserBadgesInput>
    where?: BadgeWhereInput
  }

  export type BadgeUpdateToOneWithWhereWithoutUserBadgesInput = {
    where?: BadgeWhereInput
    data: XOR<BadgeUpdateWithoutUserBadgesInput, BadgeUncheckedUpdateWithoutUserBadgesInput>
  }

  export type BadgeUpdateWithoutUserBadgesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
  }

  export type BadgeUncheckedUpdateWithoutUserBadgesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    criteria?: JsonNullValueInput | InputJsonValue
  }

  export type DailyCheckInCreateManyUserInput = {
    id?: number
    checkinDate?: Date | string
    moodDetected: string
    moodSelected: string
    answers: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
  }

  export type RecommendationCreateManyUserInput = {
    id?: number
    checkinId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type UserBadgeCreateManyUserInput = {
    badgeId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type DailyCheckInUpdateWithoutUserInput = {
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationUpdateManyWithoutDailyCheckInNestedInput
  }

  export type DailyCheckInUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationUncheckedUpdateManyWithoutDailyCheckInNestedInput
  }

  export type DailyCheckInUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    checkinDate?: DateTimeFieldUpdateOperationsInput | Date | string
    moodDetected?: StringFieldUpdateOperationsInput | string
    moodSelected?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUpdateWithoutUserInput = {
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyCheckIn?: DailyCheckInUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type RecommendationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    checkinId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    checkinId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBadgeUpdateWithoutUserInput = {
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    badge?: BadgeUpdateOneRequiredWithoutUserBadgesNestedInput
  }

  export type UserBadgeUncheckedUpdateWithoutUserInput = {
    badgeId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserBadgeUncheckedUpdateManyWithoutUserInput = {
    badgeId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RecommendationCreateManyDailyCheckInInput = {
    id?: number
    userId: number
    recommendationDate?: Date | string
    outfits: JsonNullValueInput | InputJsonValue
    makeup: JsonNullValueInput | InputJsonValue
    music: JsonNullValueInput | InputJsonValue
    feedbackPositive?: boolean | null
    createdAt?: Date | string
  }

  export type RecommendationUpdateWithoutDailyCheckInInput = {
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type RecommendationUncheckedUpdateWithoutDailyCheckInInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUncheckedUpdateManyWithoutDailyCheckInInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    recommendationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    outfits?: JsonNullValueInput | InputJsonValue
    makeup?: JsonNullValueInput | InputJsonValue
    music?: JsonNullValueInput | InputJsonValue
    feedbackPositive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBadgeCreateManyBadgeInput = {
    userId: number
    progress?: number
    unlockedAt?: Date | string | null
  }

  export type UserBadgeUpdateWithoutBadgeInput = {
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutUserBadgesNestedInput
  }

  export type UserBadgeUncheckedUpdateWithoutBadgeInput = {
    userId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserBadgeUncheckedUpdateManyWithoutBadgeInput = {
    userId?: IntFieldUpdateOperationsInput | number
    progress?: IntFieldUpdateOperationsInput | number
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}