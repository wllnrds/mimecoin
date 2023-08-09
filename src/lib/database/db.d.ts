import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Status = "active" | "blocked" | "deactive" | "new";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TransactionStatus = "cancelled" | "confirmed" | "pending";

export type TransactionType = "bonus" | "cashback" | "deposit" | "mint" | "payment" | "refund" | "transfer" | "withdraw";

export interface AccessToken {
  id: Generated<number>;
  id_user: number | null;
  id_namespace: number | null;
  key: string | null;
  secret: string | null;
  expires_at: string | null;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface Account {
  id: Generated<number>;
  id_customer: number | null;
  namespace_code: string | null;
  account_number: string | null;
  account_key: string | null;
  account_password: string | null;
  balance: number | null;
  balance_extra: number | null;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface Customer {
  id: Generated<number>;
  name: string | null;
  birthday: Timestamp | null;
  email: string | null;
  document: string | null;
  status: Status | null;
  pin: string | null;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface Namespace {
  id: Generated<number>;
  code: string;
  pic: string | null;
  name: string;
  status: Status;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp | null>;
  created_by: number;
}

export interface NamespaceLimit {
  id: Generated<number>;
  id_namespace: number | null;
  max_offer: number | null;
  precision: number | null;
  expires_at: Timestamp | null;
  active: Generated<boolean | null>;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface PaymentOrder {
  id: Generated<number>;
  digits: string | null;
  id_account_origin: number | null;
  due: Timestamp | null;
  amount: number | null;
  status: TransactionStatus | null;
  created_at: Generated<Timestamp | null>;
}

export interface Transaction {
  id: Generated<number>;
  type: TransactionType | null;
  amount: number | null;
  headline: string | null;
  details: string | null;
  id_account: Generated<number>;
  id_namespace: Generated<number>;
  id_account_origin: number | null;
  id_account_target: number | null;
  status: TransactionStatus | null;
  hash: string | null;
  created_at: Generated<Timestamp | null>;
  confirmed_at: Timestamp | null;
}

export interface User {
  id: Generated<number>;
  name: string | null;
  email: string | null;
  password: string | null;
  status: Status | null;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface UserLimit {
  id: Generated<number>;
  id_user: number | null;
  max_namespaces: number | null;
  expires_at: Timestamp | null;
  active: Generated<boolean | null>;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface UserNamespace {
  id_user: number;
  id_namespace: number;
  created_at: Generated<Timestamp | null>;
  updated_at: Generated<Timestamp | null>;
}

export interface DB {
  access_token: AccessToken;
  account: Account;
  customer: Customer;
  namespace: Namespace;
  namespace_limit: NamespaceLimit;
  payment_order: PaymentOrder;
  transaction: Transaction;
  user: User;
  user_limit: UserLimit;
  user_namespace: UserNamespace;
}
