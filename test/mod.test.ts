// deno-lint-ignore-file ban-ts-comment
import { AnyBrand, Brand, identity, make } from "../src/mod.ts";
import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import {
  assertType,
  IsExact,
} from "https://deno.land/std@0.202.0/testing/types.ts";

Deno.test("identity", () => {
  Deno.test("returns the same value", () => {
    const input = {};
    assertEquals(identity(input), input);
  });
});

Deno.test("make", () => {
  Deno.test("returns `identity`", () => {
    assertEquals(make<AnyBrand>(), identity);
  });
});

Deno.test("usecases", () => {
  Deno.test("string brands", () => {
    type UppercaseString = Brand<string, "UppercaseString">;
    type LowercaseString = Brand<string, "LowercaseString">;

    const uppercaseString = make<UppercaseString>()("test1");
    const lowercaseString = make<LowercaseString>()("test2");
    // @ts-expect-error
    make<UppercaseString>()(1); // this should be illegal
    // @ts-expect-error
    make<LowercaseString>()(2); // this should be illegal

    assertType<IsExact<typeof uppercaseString, typeof lowercaseString>>(false);
    assertType<IsExact<typeof lowercaseString, typeof uppercaseString>>(false);
    assertType<IsExact<typeof uppercaseString, typeof uppercaseString>>(true);
    assertType<IsExact<typeof lowercaseString, typeof lowercaseString>>(true);

    const u1 = make<UppercaseString>()("sth");
    const l1 = make<LowercaseString>()("sth");
    assertType<IsExact<typeof uppercaseString, typeof u1>>(true);
    assertType<IsExact<typeof lowercaseString, typeof l1>>(true);

    ((_a: UppercaseString) => {})(uppercaseString);
    ((_a: LowercaseString) => {})(lowercaseString);
    // @ts-expect-error
    ((_a: UppercaseString) => {})(lowercaseString); // this should be illegal
    // @ts-expect-error
    ((_a: LowercaseString) => {})(uppercaseString); // this should be illegal
  });

  Deno.test("number brands", () => {
    type Miliseconds = Brand<number, "Miliseconds">;
    type Microseconds = Brand<number, "Microseconds">;

    const milis = make<Miliseconds>()(1);
    const micros = make<Microseconds>()(2);

    assertType<IsExact<typeof milis, typeof micros>>(false);
    assertType<IsExact<typeof micros, typeof milis>>(false);
    ((_a: Miliseconds) => {})(milis);
    ((_a: Microseconds) => {})(micros);
    // @ts-expect-error
    ((_a: Miliseconds) => {})(micros); // this should be illegal
    // @ts-expect-error
    ((_a: Microseconds) => {})(milis); // this should be illegal
  });
});
